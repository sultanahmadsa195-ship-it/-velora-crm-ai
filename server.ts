import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Route for chat and business generation tools
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, promptType, context } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback mock responses when key is not set
        const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].text : "";
        let mockResponse = "";
        
        if (promptType === "email") {
          mockResponse = `Subject: Proposal & Strategic Scope for ${context?.customerName || 'Client'}\n\nDear ${context?.customerName || 'Client'},\n\nI hope you're having an excellent week.\n\nFollowing up on our recent conversation, I have drafted the service plan and budget estimate for our upcoming **${context?.serviceName || 'Consulting Engagement'}** project.\n\nHere is a high-level overview:\n- **Service:** ${context?.serviceName || 'Creative Campaign Strategy'}\n- **Scope:** Complete analysis of your primary visual assets, positioning strategy, and deliverables outline.\n- **Investment:** $${context?.price || '0.00'} (50% upfront retainer, 50% on final approval)\n\nPlease let me know if this aligns with your expectations, or if you would like to schedule a brief call to adjust the parameters before we issue a formal invoice.\n\nWarm regards,\n\nSarah Jenkins\nManaging Director\nApex Creative Agency`;
        } else if (promptType === "quote") {
          mockResponse = `### SERVICE ESTIMATE: ${context?.quoteNumber || 'EST-2026-X'}\n**Prepared by:** Apex Creative Agency\n**Prepared for:** ${context?.customerName || 'Eleanor Vance'}\n**Date:** July 5, 2026\n\n---\n\n#### **1. Scope of Services**\nWe will deliver a comprehensive strategic rollout comprising:\n- **Primary Initiative:** ${context?.serviceName || 'Brand Audit & Creative Strategy'}\n- **Deliverables:** Detailed visual asset audit report, brand messaging matrix, and a tokenized style document.\n- **Target Timeline:** 4-6 weeks from deposit validation.\n\n#### **2. Investment Breakdown**\n| Service / Item | Qty | Unit Price | Total |\n| :--- | :---: | :---: | :---: |\n| ${context?.serviceName || 'Brand Audit consulting'} | 1 | $${context?.price || '1,500.00'} | $${context?.price || '1,500.00'} |\n| **Subtotal** | | | **$${context?.price || '1,500.00'}** |\n| **Est. Tax (8%)** | | | **$${((context?.price || 0) * 0.08).toFixed(2)}** |\n| **Total Estimate** | | | **$${((context?.price || 0) * 1.08).toFixed(2)}** |\n\n---\n\n#### **3. Authorization Terms**\n- 50% due upon execution of formal contract; balance due upon final presentation.\n- This estimate is valid for 30 calendar days.\n\nTo accept this quotation and convert it into an invoice, please notify Sarah Jenkins.`;
        } else if (promptType === "summarize") {
          mockResponse = `### Executive Client Summary: ${context?.customerName || 'Eleanor Vance'}\n\n**Aesthetic & Strategic Profile:**\n- Highly values luxury minimalism, clean layout designs, and elegant typography integrations.\n- Prefers primary accent color palettes featuring deep navy, warm copper gold, and soft eggshell off-whites.\n\n**Key Historic Highlights:**\n- Successfully booked and paid for a $1,500 Brand Audit campaign in May 2026.\n- Communications emphasize efficiency; prefers direct email correspondence with clearly bulleted updates.\n\n**Operational Action Items:**\n1. Assemble and share Phase 1 draft wireframes by mid-July.\n2. Draft and coordinate Q3 search and social media campaign recommendations.\n3. Send invoice reminder notifications only if past 10 days overdue.`;
        } else {
          // Standard business advisor answers
          if (lastMsg.toLowerCase().includes("revenue") || lastMsg.toLowerCase().includes("invoice") || lastMsg.toLowerCase().includes("report")) {
            mockResponse = "### Quick Revenue Insights\n\nYour active gross pipeline is looking solid. Here is a brief strategic assessment:\n\n- **Invoiced Gross:** You have generated **$14,488** in billed volume across 4 invoices.\n- **Received Revenue:** **$5,848** has been fully collected via stripe and bank wire transfers.\n- **Accounts Receivable:** **$8,640** remains pending. Marion Ravenwood's Phase 1 UI invoice ($7,020) is due in 4 days, while Rene Belloq's invoice is currently overdue.\n\n**Strategic Recommendation:** I advise sending a polite automated check-in reminder to Marion tomorrow to ensure smooth project sign-off and immediate payment routing.";
          } else if (lastMsg.toLowerCase().includes("task") || lastMsg.toLowerCase().includes("priority") || lastMsg.toLowerCase().includes("todo")) {
            mockResponse = "### Priority Operational Audit\n\nYou currently have **4 active tasks** in your queue:\n\n1. **Finalize Brand Strategy Documentation** for Marion Ravenwood (High Priority, due in 1 day) - *Critical path action item.*\n2. **Draft Landing Page Wireframe** for Vance Corp (High Priority, due in 3 days).\n3. **Follow up on Cairo Logistics Quote** with Sallah (Medium Priority, due in 5 days).\n4. **Brody Media Metrics Review** (Medium Priority, due in 7 days).\n\n**Recommendation:** Block out 3 hours tomorrow morning to finalize Marion's brand booklet. Once that is sent, you can immediately initiate Sallah's follow-up to secure the SEO Alignment contract ($3,252).";
          } else {
            mockResponse = "### Welcome to the BizFlow Business Advisory Engine\n\nHello! I am your operational assistant, trained in boutique consultancy workflows and small business development. I have analyzed your settings, clients list, services menu, outstanding invoices, and task schedules.\n\nHere is what I can assist with right now:\n1. ✉️ **Draft a Customer Email** based on recent billing or appointments.\n2. 📄 **Generate an Estimate/Quotation** with scope and authorized terms.\n3. 🔍 **Summarize Customer Notes** into structured key preferences and action items.\n4. 💡 **Brainstorm Service Pricing** or digital marketing strategies.\n\nWhat business challenge can we solve today?";
          }
        }
        return res.json({ text: mockResponse, source: "mock-fallback" });
      }

      // Initialize real Google GenAI Client
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let promptText = "";
      if (promptType === "email") {
        promptText = `Draft a highly professional, polite business email from Sarah Jenkins (Managing Director at Apex Creative Agency) to client ${context?.customerName || 'Client'} (${context?.customerEmail || 'No Email'}).
        The email should discuss the following context: ${context?.details || 'a follow-up on our service and alignment'}.
        Service of interest: ${context?.serviceName || 'our services'} priced at $${context?.price || '0.00'}.
        Ensure the tone is premium, clean, reassuring, and encourages a response. Return ONLY the email draft text with standard headers.`;
      } else if (promptType === "quote") {
        promptText = `Draft a detailed, clean, and professional service quotation/estimate for client ${context?.customerName || 'Client'} of ${context?.customerCompany || 'their company'}.
        The estimate should detail: ${context?.serviceName || 'Creative consulting package'} priced at $${context?.price || '0.00'}.
        Include a elegant scope description, payment terms (e.g. 50% upfront, 50% upon delivery), and a friendly sign-off.
        Return ONLY the estimate text, beautifully formatted in Markdown.`;
      } else if (promptType === "summarize") {
        promptText = `Analyze and summarize the following client notes and communication history for customer ${context?.customerName || 'Client'}:
        "${context?.notes || 'No notes available'}"
        Synthesize this into a concise, scannable executive summary featuring Key Preferences, Historical Background, and clear Action Items for Sarah Jenkins. Format with crisp markdown bullet points.`;
      } else {
        const systemInstruction = `You are the BizFlow AI Business Assistant, an expert executive advisor, copywriter, and strategist integrated into a small business management dashboard.
        Your owner is Sarah Jenkins of "Apex Creative Agency", a premium boutique digital design and strategy consulting firm.
        You have direct access to their suite of business records (including invoices, payments, customers, active services, appointments, and tasks).
        When the user asks questions, give extremely specific, actionable, professional, and strategic advice.
        Keep replies clear, formatting with elegant markdown headings, bullet points, and highlight metrics where relevant. Avoid generic fluff.`;

        // Format messages for standard Chat session in @google/genai
        const formattedContents = messages.map((m: any) => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: formattedContents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        return res.json({ text: response.text });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
      });

      return res.json({ text: response.text });

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error?.message || "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

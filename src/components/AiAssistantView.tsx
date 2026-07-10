import React, { useState, useEffect, useRef } from 'react';
import { useBusiness } from '../context/BusinessContext';
import { 
  Send, 
  Sparkles, 
  Mail, 
  FileText, 
  User, 
  Copy, 
  Check, 
  CornerDownLeft,
  Bot,
  RefreshCw,
  Zap,
  BookOpen
} from 'lucide-react';
import { ChatMessage } from '../types';

export const AiAssistantView: React.FC = () => {
  const { customers, services, customerNotes } = useBusiness();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "### Welcome to your Velora CRM AI Assistant\n\nI am connected to your clients ledger, active invoices, tasks pipeline, and historical consultation logs. \n\nHow can I help you today? You can choose one of my specialized workflow modules on the right, or ask me any strategic and operational questions below.",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // AI Preset Tool States
  const [activeTool, setActiveTool] = useState<'chat' | 'email' | 'quote' | 'summarize'>('chat');
  
  // Form contextual parameters
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [customPrice, setCustomPrice] = useState(services[0]?.price.toString() || '0');
  const [notesDetails, setNotesDetails] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check sessionStorage on mount for any incoming redirection triggers
  useEffect(() => {
    const presetType = sessionStorage.getItem('ai_preset_type');
    const presetCustomerId = sessionStorage.getItem('ai_preset_customer_id');

    if (presetType && (presetType === 'email' || presetType === 'quote' || presetType === 'summarize')) {
      setActiveTool(presetType);
      if (presetCustomerId) {
        setSelectedCustomerId(presetCustomerId);
      }
      
      // Clean up session triggers
      sessionStorage.removeItem('ai_preset_type');
      sessionStorage.removeItem('ai_preset_customer_id');
      sessionStorage.removeItem('ai_preset_customer_name');
      sessionStorage.removeItem('ai_preset_customer_email');
    }
  }, [customers]);

  // Handle service price update when service selection changes
  useEffect(() => {
    const srv = services.find(s => s.id === selectedServiceId);
    if (srv) {
      setCustomPrice(srv.price.toString());
    }
  }, [selectedServiceId, services]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: inputText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, text: m.text })),
          promptType: 'chat'
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        text: "🚨 *Service Timeout*: I was unable to complete the request. Please verify your GEMINI_API_KEY settings or check connectivity.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunPresetTool = async () => {
    if (isLoading) return;

    const cust = customers.find(c => c.id === selectedCustomerId);
    const srv = services.find(s => s.id === selectedServiceId);
    
    // Retrieve notes if summarizing
    let extractedNotesText = '';
    if (activeTool === 'summarize') {
      const notes = customerNotes.filter(n => n.customerId === selectedCustomerId);
      extractedNotesText = notes.map(n => `[${n.type.toUpperCase()} - ${n.createdAt}] ${n.note}`).join('\n');
    }

    setIsLoading(true);
    
    // Optimistically insert user request intent
    const intentText = activeTool === 'email' 
      ? `Draft follow-up email for **${cust?.name}** regarding **${srv?.name}** ($${customPrice})`
      : activeTool === 'quote'
        ? `Generate detailed estimate proposal for **${cust?.name}** for **${srv?.name}**`
        : `Summarize client interaction logs and notes for **${cust?.name}**`;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      text: intentText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptType: activeTool,
          context: {
            customerName: cust?.name,
            customerEmail: cust?.email,
            customerCompany: cust?.company,
            serviceName: srv?.name,
            price: Number(customPrice),
            details: notesDetails,
            notes: extractedNotesText || notesDetails
          }
        })
      });

      if (!response.ok) throw new Error('API failed');
      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'model',
        text: data.text,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMsg]);
      
      // Clear notes field
      setNotesDetails('');
      // Return to chat panel after generating
      setActiveTool('chat');
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-err`,
        role: 'model',
        text: "🚨 *Strategic Advisor Error*: Could not compile custom preset. Please check your system endpoints.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (text: string) => {
    // Basic Markdown Parser (converts headers, bold, bullets, lists)
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // 1. Headers
      if (line.startsWith('### ')) {
        return <h4 key={idx} className="text-sm font-bold text-gray-900 dark:text-zinc-50 mt-4 mb-2 first:mt-0">{line.replace('### ', '')}</h4>;
      }
      if (line.startsWith('## ')) {
        return <h3 key={idx} className="text-base font-bold text-gray-900 dark:text-zinc-50 mt-5 mb-2 first:mt-0">{line.replace('## ', '')}</h3>;
      }
      if (line.startsWith('# ')) {
        return <h2 key={idx} className="text-lg font-bold text-gray-900 dark:text-zinc-50 mt-6 mb-3 first:mt-0">{line.replace('# ', '')}</h2>;
      }

      // 2. Bold markings (**text**)
      let content: React.ReactNode = line;
      if (line.includes('**')) {
        const parts = line.split('**');
        content = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-gray-900 dark:text-white">{part}</strong> : part);
      }

      // 3. Bullets / Lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="list-disc pl-5 text-xs text-gray-700 dark:text-zinc-300 ml-2 mt-1">
            {line.replace(/^[\s\-\*]+/, '')}
          </li>
        );
      }

      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <li key={idx} className="list-decimal pl-5 text-xs text-gray-700 dark:text-zinc-300 ml-2 mt-1">
            {line.replace(/^\d+\.\s+/, '')}
          </li>
        );
      }

      // Default paragraph
      return line.trim() === '' ? <div key={idx} className="h-2" /> : (
        <p key={idx} className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed mt-1 font-normal">
          {content}
        </p>
      );
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] bg-gray-50 dark:bg-zinc-950">
      
      {/* LEFT AREA: CHAT STREAM CONVERSATION */}
      <div className="flex-1 flex flex-col bg-white border-r border-gray-100 dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-zinc-50">Strategic Advisor Partner</h1>
              <p className="text-4xs text-gray-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
                Powered by Gemini 3.5 AI
              </p>
            </div>
          </div>
          <button 
            id="ai-clear-conversation"
            onClick={() => setMessages([messages[0]])}
            className="flex items-center gap-1.5 text-3xs font-semibold text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Restart Chat</span>
          </button>
        </div>

        {/* Scrollable Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            return (
              <div 
                key={msg.id}
                className={`flex gap-4 ${isBot ? 'max-w-2xl' : 'max-w-xl ml-auto flex-row-reverse'}`}
              >
                {/* Avatar icon */}
                <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs shadow-3xs
                  ${isBot 
                    ? 'bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900' 
                    : 'bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  }
                `}>
                  {isBot ? <Sparkles className="h-4 w-4" /> : 'Me'}
                </div>

                {/* Message Speech bubble */}
                <div className={`relative group p-4 rounded-xl text-xs space-y-1.5 shadow-2xs leading-relaxed
                  ${isBot 
                    ? 'bg-gray-50/50 border border-gray-100 dark:bg-zinc-850/40 dark:border-zinc-800/60' 
                    : 'bg-teal-600 text-white dark:bg-teal-500'
                  }
                `}>
                  
                  {/* Text Parser rendering */}
                  <div className={`prose prose-sm font-normal max-w-none ${!isBot ? 'text-white font-medium' : ''}`}>
                    {isBot ? renderMessageContent(msg.text) : msg.text}
                  </div>

                  {/* Copy button for model responses */}
                  {isBot && (
                    <button
                      id={`ai-copy-btn-${msg.id}`}
                      onClick={() => handleCopyText(msg.text, msg.id)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500"
                      title="Copy message text"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Assistant Loading Skeleton state */}
          {isLoading && (
            <div className="flex gap-4 max-w-2xl">
              <div className="h-8 w-8 rounded-lg shrink-0 flex items-center justify-center bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-950/40 dark:text-teal-400 animate-spin">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 space-y-2.5 w-full dark:bg-zinc-850/40 dark:border-zinc-800/60">
                <div className="h-2 w-3/4 rounded-sm bg-gray-200 animate-pulse dark:bg-zinc-800" />
                <div className="h-2 w-1/2 rounded-sm bg-gray-200 animate-pulse dark:bg-zinc-800" />
                <div className="h-2 w-2/3 rounded-sm bg-gray-200 animate-pulse dark:bg-zinc-800" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Dynamic chat prompt bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 bg-gray-50/50 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="relative flex items-center">
            <input
              id="ai-chat-input-field"
              type="text"
              disabled={isLoading}
              placeholder="Ask about revenue trends, active task queues, or strategy tips..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full rounded-xl border border-gray-150 py-3 pl-4 pr-12 text-xs text-gray-900 focus:border-gray-300 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-100 dark:focus:border-zinc-700 dark:focus:bg-zinc-900 disabled:opacity-50"
            />
            <button
              id="ai-chat-submit-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-950 text-white hover:bg-gray-800 disabled:opacity-30 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>

      </div>

      {/* RIGHT AREA: AI ACTION WORKFLOW TOOLS */}
      <div className="w-full lg:w-80 p-5 space-y-5 bg-gray-50 dark:bg-zinc-950 select-none shrink-0">
        <div>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest dark:text-zinc-400">
            CRM AI Playbooks
          </h3>
          <p className="text-3xs text-gray-400 dark:text-zinc-500 mt-1">
            Accelerated generative modules connected to your business data
          </p>
        </div>

        {/* Tab Controllers */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-gray-100 dark:bg-zinc-900">
          <button
            id="tab-playbook-email"
            onClick={() => setActiveTool(activeTool === 'email' ? 'chat' : 'email')}
            className={`py-1.5 rounded-md text-3xs font-semibold uppercase tracking-wider text-center transition-all ${activeTool === 'email' ? 'bg-white text-gray-900 shadow-3xs dark:bg-zinc-800 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'}`}
          >
            Email
          </button>
          <button
            id="tab-playbook-quote"
            onClick={() => setActiveTool(activeTool === 'quote' ? 'chat' : 'quote')}
            className={`py-1.5 rounded-md text-3xs font-semibold uppercase tracking-wider text-center transition-all ${activeTool === 'quote' ? 'bg-white text-gray-900 shadow-3xs dark:bg-zinc-800 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'}`}
          >
            Quote
          </button>
          <button
            id="tab-playbook-summarize"
            onClick={() => setActiveTool(activeTool === 'summarize' ? 'chat' : 'summarize')}
            className={`py-1.5 rounded-md text-3xs font-semibold uppercase tracking-wider text-center transition-all ${activeTool === 'summarize' ? 'bg-white text-gray-900 shadow-3xs dark:bg-zinc-800 dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:text-zinc-400'}`}
          >
            Summary
          </button>
        </div>

        {/* Dynamic Context Tool Cards */}
        {activeTool !== 'chat' ? (
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-xs space-y-4 dark:border-zinc-850 dark:bg-zinc-900 animate-slide-in-right text-xs">
            
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50 dark:border-zinc-800">
              {activeTool === 'email' ? (
                <>
                  <Mail className="h-4 w-4 text-teal-500" />
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Draft Customer Email</span>
                </>
              ) : activeTool === 'quote' ? (
                <>
                  <FileText className="h-4 w-4 text-teal-500" />
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Compose Quotation Estimate</span>
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 text-teal-500" />
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Summarize Customer Logs</span>
                </>
              )}
            </div>

            {/* Select Customer */}
            <div>
              <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Target Customer Profile</label>
              <select
                id="preset-customer-select"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full rounded-lg border border-gray-150 p-2 bg-white text-gray-800 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-200"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Additional parameters for Email and Quote playbooks */}
            {(activeTool === 'email' || activeTool === 'quote') && (
              <>
                {/* Select Service */}
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Service Reference</label>
                  <select
                    id="preset-service-select"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2 bg-white text-gray-800 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-200"
                  >
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price Customizer */}
                <div>
                  <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">Quoted Price ($)</label>
                  <input
                    id="preset-price-input"
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-full rounded-lg border border-gray-150 p-2 text-gray-800 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-200 focus:outline-hidden"
                  />
                </div>
              </>
            )}

            {/* Input Extra Scope Guidelines */}
            <div>
              <label className="block font-semibold text-gray-600 dark:text-zinc-400 mb-1">
                {activeTool === 'summarize' ? 'Additional comments' : 'Extra Scope Guidelines'}
              </label>
              <textarea
                id="preset-guidelines-textarea"
                placeholder={activeTool === 'summarize' ? 'Include custom operational milestones or comments...' : 'e.g., Prefers navy blue colors, 4 weeks timelines...'}
                rows={3}
                value={notesDetails}
                onChange={(e) => setNotesDetails(e.target.value)}
                className="w-full rounded-lg border border-gray-150 p-2 text-gray-800 dark:border-zinc-850 dark:bg-zinc-850 dark:text-zinc-200 focus:outline-hidden"
              />
            </div>

            <button
              id="preset-run-button"
              onClick={handleRunPresetTool}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-teal-600 py-2 text-xs font-semibold text-white hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Compile Draft</span>
            </button>

          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center dark:border-zinc-800">
            <span className="text-3xs text-gray-400 dark:text-zinc-500 font-mono">
              Ready to write custom prompts or use active presets in the Customers View module.
            </span>
          </div>
        )}

      </div>

    </div>
  );
};
export default AiAssistantView;

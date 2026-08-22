import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Lead, CustomerMessageData } from '../types';
import {
  MessageSquareShare,
  Sparkles,
  Users,
  Copy,
  Check,
  Send,
  Clock,
  Lightbulb,
  Paperclip,
  CheckCircle2,
  RefreshCw,
  Mail,
  MessageCircle,
  Share2,
} from 'lucide-react';

export const CustomerEngagementPage: React.FC = () => {
  const { business } = useAuth();
  const { success, error, agent } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('custom');
  const [recipientName, setRecipientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [messageType, setMessageType] = useState('Follow-up');
  const [tone, setTone] = useState('Friendly & Professional');
  const [channel, setChannel] = useState('Email');
  const [specificContext, setSpecificContext] = useState('');

  const [generatedMessage, setGeneratedMessage] = useState<CustomerMessageData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const list = await api.getLeads();
        setLeads(list);
        if (list.length > 0) {
          const first = list[0];
          setSelectedLeadId(first.id);
          setRecipientName(first.name);
          setCompanyName(first.company || '');
          setSpecificContext(first.interest ? `Interested in: ${first.interest}` : '');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeads();
  }, []);

  const handleLeadSelect = (id: string) => {
    setSelectedLeadId(id);
    if (id === 'custom') {
      setRecipientName('');
      setCompanyName('');
      setSpecificContext('');
    } else {
      const found = leads.find((l) => l.id === id);
      if (found) {
        setRecipientName(found.name);
        setCompanyName(found.company || '');
        setSpecificContext(found.interest ? `Inquiry context: ${found.interest}` : '');
      }
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!recipientName.trim()) {
      error('Missing Recipient', 'Please provide a recipient name.');
      return;
    }

    setIsGenerating(true);
    agent('Engagement Agent Active', `Generating personalized ${messageType} for ${recipientName}...`);
    try {
      const res = await api.generateCustomerMessage({
        leadOrCustomerName: recipientName.trim(),
        companyName: companyName.trim() || undefined,
        messageType,
        tone,
        specificContext: specificContext.trim() || undefined,
        channel,
      });
      setGeneratedMessage(res);
      success('Message Crafted', `Personalized ${messageType} ready to send`);
    } catch (err: any) {
      error('Generation Failed', err.message || 'Could not craft message');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    const fullText = generatedMessage.subjectLine
      ? `Subject: ${generatedMessage.subjectLine}\n\n${generatedMessage.formattedMessage}`
      : generatedMessage.formattedMessage;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    success('Message Copied', 'Ready to paste into your email or chat app');
    setTimeout(() => setCopied(false), 2000);
  };

  const messageTypes = [
    'Welcome',
    'Follow-up',
    'Re-engagement',
    'Upselling',
    'Thank-you',
  ];

  const tones = [
    'Professional',
    'Friendly',
    'Persuasive',
    'Casual',
  ];

  const channels = ['Email', 'WhatsApp', 'Instagram DM', 'LinkedIn InMail'];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-600/25">
            <MessageSquareShare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                AI Customer Engagement & Messaging
              </h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                Personalized Communication
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Generates tailored outreach, re-engagement offers, and loyalty notes calibrated for every buyer relationship.
            </p>
          </div>
        </div>
      </div>

      {/* Input Parameters Box */}
      <form onSubmit={handleGenerate} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Recipient Source Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Select From CRM Leads
            </label>
            <select
              value={selectedLeadId}
              onChange={(e) => handleLeadSelect(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            >
              <option value="custom">-- Custom Recipient --</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} {l.company ? `(${l.company})` : ''} - {l.status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Recipient Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Jordan Mitchell"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Company / Event Name
            </label>
            <input
              type="text"
              placeholder="e.g. Apex Tech Summit"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Message Type, Tone, Channel Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Message Objective
            </label>
            <select
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            >
              {messageTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Communication Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            >
              {tones.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Delivery Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
            >
              {channels.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Specific Context */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Specific Deal Context / Notes (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Inquired about 250 embroidered jackets, asked for discount code, event is next month..."
            value={specificContext}
            onChange={(e) => setSpecificContext(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
          />
        </div>

        <div className="pt-2 flex items-center justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Crafting Message...' : 'Craft AI Message'}</span>
          </button>
        </div>
      </form>

      {/* Generated Message Box */}
      {generatedMessage && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Personalized {generatedMessage.messageType} Draft ({generatedMessage.tone} Tone)
                </h3>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/60 text-violet-600 dark:text-violet-300 text-xs font-semibold border border-violet-200 dark:border-violet-800/60 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Message</span>
                  </>
                )}
              </button>
            </div>

            {generatedMessage.subjectLine && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 block mb-0.5">
                  Subject Line:
                </span>
                <p className="text-slate-900 dark:text-white font-semibold">{generatedMessage.subjectLine}</p>
              </div>
            )}

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed select-text font-sans">
              {generatedMessage.formattedMessage}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Recommended Send Timing: <strong className="text-slate-800 dark:text-slate-200">{generatedMessage.recommendedSendTiming}</strong></span>
            </div>
          </div>

          {/* Pro Tips & Suggested Attachments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Suggested Attachments/Offers */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-violet-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Recommended Collateral & Offers
                </h3>
              </div>
              <div className="space-y-2">
                {generatedMessage.suggestedAttachmentsOrOffers.map((att, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    <span>{att}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tips for Closing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  AI Sales Closing Tips
                </h3>
              </div>
              <div className="space-y-2">
                {generatedMessage.proTipsForClosing.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

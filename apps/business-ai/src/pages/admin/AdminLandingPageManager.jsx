import React, { useState, useEffect } from 'react';
import {
  Globe, Save, RefreshCw, CheckCircle2, AlertCircle, Plus, Trash2,
  Image as ImageIcon, Layout, Layers, Sparkles, MessageSquare, HelpCircle,
  CreditCard, Shield, Eye
} from 'lucide-react';
import { useSiteContent, DEFAULT_SITE_CONTENT } from '../../context/SiteContentContext';
import { adminService } from '../../services/adminService';

function getMergedContent(raw) {
  const base = DEFAULT_SITE_CONTENT;
  if (!raw || typeof raw !== 'object' || Object.keys(raw).length === 0) return base;
  return {
    ...base,
    ...raw,
    branding: { ...base.branding, ...(raw.branding || {}) },
    hero: {
      ...base.hero,
      ...(raw.hero || {}),
      stats: raw.hero?.stats?.length ? raw.hero.stats : base.hero.stats,
      dashboard: { ...base.hero.dashboard, ...(raw.hero?.dashboard || {}) }
    },
    howItWorks: {
      ...base.howItWorks,
      ...(raw.howItWorks || {}),
      steps: raw.howItWorks?.steps?.length ? raw.howItWorks.steps : base.howItWorks.steps
    },
    opportunityFinder: {
      ...base.opportunityFinder,
      ...(raw.opportunityFinder || {}),
      opportunities: raw.opportunityFinder?.opportunities?.length ? raw.opportunityFinder.opportunities : base.opportunityFinder.opportunities,
      metrics: raw.opportunityFinder?.metrics?.length ? raw.opportunityFinder.metrics : base.opportunityFinder.metrics
    },
    audiences: {
      ...base.audiences,
      ...(raw.audiences || {}),
      items: raw.audiences?.items?.length ? raw.audiences.items : base.audiences.items
    },
    testimonials: {
      ...base.testimonials,
      ...(raw.testimonials || {}),
      reviews: raw.testimonials?.reviews?.length ? raw.testimonials.reviews : base.testimonials.reviews
    },
    pricing: {
      ...base.pricing,
      ...(raw.pricing || {}),
      plans: raw.pricing?.plans?.length ? raw.pricing.plans : base.pricing.plans
    },
    faq: {
      ...base.faq,
      ...(raw.faq || {}),
      items: raw.faq?.items?.length ? raw.faq.items : base.faq.items
    },
    finalCta: { ...base.finalCta, ...(raw.finalCta || {}) },
    footer: { ...base.footer, ...(raw.footer || {}) },
  };
}

export default function AdminLandingPageManager() {
  const { content, saveAllContent, resetToDefault } = useSiteContent();
  const [formData, setFormData] = useState(() => getMergedContent(content));
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    if (content && Object.keys(content).length > 0) {
      setFormData(getMergedContent(content));
    }
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    setErrMessage('');

    try {
      // 1. Update React Context and localStorage immediately
      saveAllContent(formData);

      // 2. Try persisting each section to Spring Boot backend API if online
      const sections = ['branding', 'hero', 'howItWorks', 'opportunityFinder', 'audiences', 'testimonials', 'pricing', 'faq', 'finalCta', 'footer'];
      for (const sec of sections) {
        if (formData[sec]) {
          await adminService.saveSiteContentSection(sec, formData[sec]).catch(() => {});
        }
      }

      setMessage('Landing page content saved and published live to website!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      setErrMessage('Failed to save to backend API, but local content was updated.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all landing page content to defaults?')) {
      resetToDefault();
      setFormData(DEFAULT_SITE_CONTENT);
      setMessage('Reset to default landing page layout.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const updateHeroField = (field, val) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: val }
    }));
  };

  const updateStatItem = (idx, field, val) => {
    setFormData(prev => {
      const stats = [...(prev.hero.stats || [])];
      stats[idx] = { ...stats[idx], [field]: val };
      return { ...prev, hero: { ...prev.hero, stats } };
    });
  };

  const updateHowStep = (idx, field, val) => {
    setFormData(prev => {
      const steps = [...(prev.howItWorks.steps || [])];
      steps[idx] = { ...steps[idx], [field]: val };
      return { ...prev, howItWorks: { ...prev.howItWorks, steps } };
    });
  };

  const updateOppItem = (idx, field, val) => {
    setFormData(prev => {
      const opps = [...(prev.opportunityFinder.opportunities || [])];
      opps[idx] = { ...opps[idx], [field]: val };
      return { ...prev, opportunityFinder: { ...prev.opportunityFinder, opportunities: opps } };
    });
  };

  const updateAudienceItem = (idx, field, val) => {
    setFormData(prev => {
      const items = [...(prev.audiences.items || [])];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, audiences: { ...prev.audiences, items } };
    });
  };

  const updateTestimonialItem = (idx, field, val) => {
    setFormData(prev => {
      const reviews = [...(prev.testimonials.reviews || [])];
      reviews[idx] = { ...reviews[idx], [field]: val };
      return { ...prev, testimonials: { ...prev.testimonials, reviews } };
    });
  };

  const updateFaqItem = (idx, field, val) => {
    setFormData(prev => {
      const items = [...(prev.faq.items || [])];
      items[idx] = { ...items[idx], [field]: val };
      return { ...prev, faq: { ...prev.faq, items } };
    });
  };

  const addFaqItem = () => {
    setFormData(prev => ({
      ...prev,
      faq: {
        ...prev.faq,
        items: [...(prev.faq.items || []), { q: "New Question?", a: "Answer text here..." }]
      }
    }));
  };

  const removeFaqItem = (idx) => {
    setFormData(prev => {
      const items = (prev.faq.items || []).filter((_, i) => i !== idx);
      return { ...prev, faq: { ...prev.faq, items } };
    });
  };

  const tabs = [
    { id: 'hero', label: '1. Hero & Branding', icon: Layout },
    { id: 'how', label: '2. How It Works', icon: Layers },
    { id: 'opportunities', label: '3. Opportunity Cards', icon: Sparkles },
    { id: 'audiences', label: '4. Target Audiences', icon: ImageIcon },
    { id: 'testimonials', label: '5. Testimonials', icon: MessageSquare },
    { id: 'pricing', label: '6. Pricing Plans', icon: CreditCard },
    { id: 'faq', label: '7. FAQ & CTA', icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl mx-auto">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 backdrop-blur-xl shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Globe size={13} /> Live Landing Page Manager
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Full Control Over Homepage Content</h1>
          <p className="text-xs text-slate-400">
            Edit text, headings, statistics, cards, Unsplash images, FAQs &amp; CTAs. Changes appear immediately on the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={14} /> Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={15} />}
            <span>Save &amp; Publish Live</span>
          </button>
        </div>
      </div>

      {/* Banners */}
      {message && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {errMessage && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-400 shrink-0" />
          <span>{errMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shrink-0 ${
              activeTab === t.id
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <t.icon size={14} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Hero & Branding */}
      {activeTab === 'hero' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layout size={18} className="text-emerald-400" /> Branding &amp; Hero Main Copy
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Badge Pill</label>
              <input
                type="text"
                value={formData.hero?.badge || ''}
                onChange={e => updateHeroField('badge', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Highlight Word (Green Gradient)</label>
              <input
                type="text"
                value={formData.hero?.highlight || ''}
                onChange={e => updateHeroField('highlight', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Heading Line 1</label>
              <input
                type="text"
                value={formData.hero?.headingLine1 || ''}
                onChange={e => updateHeroField('headingLine1', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Heading Line 2</label>
              <input
                type="text"
                value={formData.hero?.headingLine2 || ''}
                onChange={e => updateHeroField('headingLine2', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Hero Description</label>
            <textarea
              rows={3}
              value={formData.hero?.description || ''}
              onChange={e => updateHeroField('description', e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Primary CTA Button Label (Green)</label>
              <input
                type="text"
                value={formData.hero?.primaryCtaLabel || ''}
                onChange={e => updateHeroField('primaryCtaLabel', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Secondary CTA Button Label</label>
              <input
                type="text"
                value={formData.hero?.secondaryCtaLabel || ''}
                onChange={e => updateHeroField('secondaryCtaLabel', e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Stat Pills */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Hero Counter Statistics (4 Items)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {(formData.hero?.stats || []).map((st, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 block">Value</span>
                    <input
                      type="text"
                      value={st.value}
                      onChange={e => updateStatItem(idx, 'value', e.target.value)}
                      className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-black text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 block">Label</span>
                    <input
                      type="text"
                      value={st.label}
                      onChange={e => updateStatItem(idx, 'label', e.target.value)}
                      className="w-full h-8 px-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: How It Works */}
      {activeTab === 'how' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Layers size={18} className="text-emerald-400" /> Five Steps Process Section
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={formData.howItWorks?.eyebrow || ''}
                onChange={e => setFormData(p => ({ ...p, howItWorks: { ...p.howItWorks, eyebrow: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Main Section Title</label>
              <input
                type="text"
                value={formData.howItWorks?.title || ''}
                onChange={e => setFormData(p => ({ ...p, howItWorks: { ...p.howItWorks, title: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {(formData.howItWorks?.steps || []).map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-black text-emerald-400 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span>Step {idx + 1}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Step Title</label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={e => updateHowStep(idx, 'title', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Step Description</label>
                    <input
                      type="text"
                      value={step.desc}
                      onChange={e => updateHowStep(idx, 'desc', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Opportunity Cards */}
      {activeTab === 'opportunities' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" /> Top Opportunity Cards &amp; Images
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Section Title</label>
              <input
                type="text"
                value={formData.opportunityFinder?.title || ''}
                onChange={e => setFormData(p => ({ ...p, opportunityFinder: { ...p.opportunityFinder, title: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Highlight Word</label>
              <input
                type="text"
                value={formData.opportunityFinder?.highlight || ''}
                onChange={e => setFormData(p => ({ ...p, opportunityFinder: { ...p.opportunityFinder, highlight: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {(formData.opportunityFinder?.opportunities || []).map((opp, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                  <span>Card {idx + 1}: {opp.name}</span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-md">{opp.tag}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Opportunity Name</label>
                    <input
                      type="text"
                      value={opp.name}
                      onChange={e => updateOppItem(idx, 'name', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Tag / Potential</label>
                    <input
                      type="text"
                      value={opp.tag}
                      onChange={e => updateOppItem(idx, 'tag', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Investment Range</label>
                    <input
                      type="text"
                      value={opp.invest}
                      onChange={e => updateOppItem(idx, 'invest', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={opp.img}
                    onChange={e => updateOppItem(idx, 'img', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Target Audiences */}
      {activeTab === 'audiences' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <ImageIcon size={18} className="text-emerald-400" /> Target Audience Cards &amp; Images
          </h3>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Section Title</label>
            <input
              type="text"
              value={formData.audiences?.title || ''}
              onChange={e => setFormData(p => ({ ...p, audiences: { ...p.audiences, title: e.target.value } }))}
              className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(formData.audiences?.items || []).map((aud, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-black text-emerald-400">Audience {idx + 1}: {aud.title}</div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Title</label>
                  <input
                    type="text"
                    value={aud.title}
                    onChange={e => updateAudienceItem(idx, 'title', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Description</label>
                  <input
                    type="text"
                    value={aud.desc}
                    onChange={e => updateAudienceItem(idx, 'desc', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Photo Image URL</label>
                  <input
                    type="text"
                    value={aud.img}
                    onChange={e => updateAudienceItem(idx, 'img', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Testimonials */}
      {activeTab === 'testimonials' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <MessageSquare size={18} className="text-emerald-400" /> Testimonials &amp; Customer Reviews
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Eyebrow</label>
              <input
                type="text"
                value={formData.testimonials?.eyebrow || ''}
                onChange={e => setFormData(p => ({ ...p, testimonials: { ...p.testimonials, eyebrow: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Section Title</label>
              <input
                type="text"
                value={formData.testimonials?.title || ''}
                onChange={e => setFormData(p => ({ ...p, testimonials: { ...p.testimonials, title: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(formData.testimonials?.reviews || []).map((rev, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-black text-emerald-400">Review {idx + 1}</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">User Name</label>
                    <input
                      type="text"
                      value={rev.name}
                      onChange={e => updateTestimonialItem(idx, 'name', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Role / Subtitle</label>
                    <input
                      type="text"
                      value={rev.role}
                      onChange={e => updateTestimonialItem(idx, 'role', e.target.value)}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Review Quote Text</label>
                  <textarea
                    rows={2}
                    value={rev.text}
                    onChange={e => updateTestimonialItem(idx, 'text', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Pricing Plans */}
      {activeTab === 'pricing' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <h3 className="text-base font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <CreditCard size={18} className="text-emerald-400" /> Membership &amp; Pricing Plans
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Title</label>
              <input
                type="text"
                value={formData.pricing?.title || ''}
                onChange={e => setFormData(p => ({ ...p, pricing: { ...p.pricing, title: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Subtitle</label>
              <input
                type="text"
                value={formData.pricing?.subtitle || ''}
                onChange={e => setFormData(p => ({ ...p, pricing: { ...p.pricing, subtitle: e.target.value } }))}
                className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(formData.pricing?.plans || []).map((plan, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-black text-emerald-400 flex items-center justify-between">
                  <span>Plan {idx + 1}: {plan.name}</span>
                  {plan.highlight && <span className="text-[9px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded">Popular</span>}
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={e => {
                      const plans = [...formData.pricing.plans];
                      plans[idx].name = e.target.value;
                      setFormData(p => ({ ...p, pricing: { ...p.pricing, plans } }));
                    }}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Price</label>
                    <input
                      type="text"
                      value={plan.price}
                      onChange={e => {
                        const plans = [...formData.pricing.plans];
                        plans[idx].price = e.target.value;
                        setFormData(p => ({ ...p, pricing: { ...p.pricing, plans } }));
                      }}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-500 font-bold block mb-1">Period</label>
                    <input
                      type="text"
                      value={plan.period}
                      onChange={e => {
                        const plans = [...formData.pricing.plans];
                        plans[idx].period = e.target.value;
                        setFormData(p => ({ ...p, pricing: { ...p.pricing, plans } }));
                      }}
                      className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={plan.cta}
                    onChange={e => {
                      const plans = [...formData.pricing.plans];
                      plans[idx].cta = e.target.value;
                      setFormData(p => ({ ...p, pricing: { ...p.pricing, plans } }));
                    }}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 7: FAQ & Final CTA */}
      {activeTab === 'faq' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <HelpCircle size={18} className="text-emerald-400" /> FAQ Items &amp; Final Call to Action
            </h3>
            <button
              type="button"
              onClick={addFaqItem}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {(formData.faq?.items || []).map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 relative group">
                <button
                  type="button"
                  onClick={() => removeFaqItem(idx)}
                  className="absolute top-3 right-3 p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                  title="Remove FAQ"
                >
                  <Trash2 size={14} />
                </button>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Question {idx + 1}</label>
                  <input
                    type="text"
                    value={faq.q}
                    onChange={e => updateFaqItem(idx, 'q', e.target.value)}
                    className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-slate-500 font-bold block mb-1">Answer</label>
                  <textarea
                    rows={2}
                    value={faq.a}
                    onChange={e => updateFaqItem(idx, 'a', e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-black uppercase text-emerald-400 tracking-wider">Final CTA Banner</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-1">Heading</label>
                <input
                  type="text"
                  value={formData.finalCta?.heading || ''}
                  onChange={e => setFormData(p => ({ ...p, finalCta: { ...p.finalCta, heading: e.target.value } }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-white"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-bold block mb-1">Button CTA Label</label>
                <input
                  type="text"
                  value={formData.finalCta?.ctaLabel || ''}
                  onChange={e => setFormData(p => ({ ...p, finalCta: { ...p.finalCta, ctaLabel: e.target.value } }))}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-extrabold text-emerald-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

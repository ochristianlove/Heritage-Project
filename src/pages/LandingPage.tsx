import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Landmark, Activity, Users, HeartHandshake } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface font-body">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[870px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Panoramic View of Houston Skyline" 
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgfugzPCuuh_VqgxxUkrEDGEUZ68lvxJ9NYYh7MS0rrwYPzZP-PY7euFqd9x9cDd6dNqJMUbC_pH_xW0w48GosB3uGXsnEttk8mB5a3ut-FFTnyl3yFuWZcdSrZwaN2BPJ6ds0ZrSdOjpg5-4PHAOZq9W_Yv_AdzC4o62OIOMDg0LR83cE0pJX3myKtuv_GM3Sm5UhqC39tIAqHS8rdAhQ75kic__TBp9VB3v_1CPfgen8tIhAlhlAqQuJRxi_cMoIX-mx_Fus6vw"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-on-surface/60 to-transparent"></div>
          </div>
          <div className="relative z-10 px-6 md:px-12 max-w-screen-2xl mx-auto w-full">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <span className="inline-block bg-secondary/10 text-secondary px-3 py-1 font-label text-xs uppercase tracking-[0.2em] mb-6">Established 1924</span>
              <h1 className="font-headline text-6xl md:text-8xl text-surface-bright leading-tight mb-8">Architects of Lasting Prosperity.</h1>
              <p className="text-surface-bright/90 text-xl md:text-2xl font-body max-w-xl mb-12 font-light leading-relaxed">
                For a century, Heritage Trust has safeguarded the capital and legacies of the families who built our future.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <button className="silk-gradient text-on-primary px-10 py-4 rounded-sm font-label text-sm uppercase tracking-widest hover:shadow-xl transition-all">
                  Partner With Us
                </button>
                <a className="text-surface-bright font-label text-sm uppercase tracking-widest border-b border-surface-bright/30 hover:border-surface-bright transition-all pb-1" href="#">
                  Explore Our History
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Purpose */}
        <section className="py-32 px-6 md:px-12 bg-surface">
          <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-5 flex flex-col justify-center"
            >
              <span className="text-primary font-label text-sm uppercase tracking-widest mb-4">Our Purpose</span>
              <h2 className="font-headline text-5xl text-on-surface leading-tight mb-8">A Commitment Beyond Generations.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                We operate on the principle that wealth is not merely a balance sheet—it is a tool for impact, a foundation for legacy, and a responsibility to the future. Our independence ensures our interests remain perfectly aligned with yours.
              </p>
              <div className="bg-surface-container-low p-8 border-l-4 border-secondary">
                <p className="italic font-headline text-xl text-on-surface">
                  "The measure of a trust is not in its growth alone, but in the peace of mind it provides to those it protects."
                </p>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="md:col-span-7"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  alt="Traditional library or office" 
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrhl0Kv_Oh16ypUe7-8MCbcJCgmrvLzxNiSwAW4Qw7_ORsi_AaxAV-A9plfHVJ1bLM-kzyF53YdEDxSj9hb9GdexaoVxq_gzrdpbKhfDBFJ48VUyQya9quDOykQpEouiszHkHO_cAVhr3VUhaxIxzZzhnexy9UH-XhGEaIJUOpP-pBMOFxc9C6fcSXtHydBxOeWoEAHTo55u1gbBc2TlVPA0t-awO49K_MdMxLxaUsd5i_tFwU0uxGytlYSgpHplNN1kbpquCF-Yo"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
            <div className="text-center mb-24">
              <h2 className="font-headline text-5xl text-on-surface mb-4">Comprehensive Stewardship</h2>
              <div className="w-24 h-px bg-outline-variant mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ServiceCard 
                icon={<Landmark size={32} />}
                title="Trusts & Estates"
                description="Sophisticated fiduciary solutions tailored to complex family dynamics and cross-generational wealth transfer strategies."
                className="md:col-span-2 hover:bg-primary"
              />
              <ServiceCard 
                icon={<Activity size={32} />}
                title="Investments"
                description="Disciplined, long-term capital allocation strategies focused on preservation and steady appreciation."
                className="hover:bg-secondary"
              />
              <ServiceCard 
                icon={<Users size={32} />}
                title="Family Office"
                description="Total financial oversight including bill pay, tax coordination, and concierge administrative support."
                className="hover:bg-tertiary"
              />
              <ServiceCard 
                icon={<HeartHandshake size={32} />}
                title="Philanthropic Advisory"
                description="Helping families define their charitable mission and structure foundations for maximum community impact and tax efficiency."
                className="md:col-span-2 hover:bg-on-surface"
              />
            </div>
          </div>
        </section>

        {/* The Heritage Difference */}
        <section className="py-32 px-6 md:px-12 bg-white overflow-hidden">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row gap-24 items-center">
            <div className="w-full md:w-1/2 relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-surface-container-low z-0"></div>
              <img 
                alt="Professional Team Meeting" 
                className="relative z-10 w-full h-[600px] object-cover rounded-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4w1dtl6ilA9eHwLpd1oeR81NRyDyxuBcoWTXB9m2VnBDhtK1iuSDB_TY0gMK5kwGCVhp8Q1XPaG0r12SncWwpx3Pe_yWX65KXUqSNNzj8N77iuMLJ8d5UdydwwXA8vcAqWRid0lsbzmA5I7xQ3bjGLLj4VOOZmnXr1IfgJf_puw3Yzz4k2-JuxKmH8kLbPt4P7rucOjd9IAi68sdMxghgNoyTaqJ9Oc-dakW-Bo32HuNexfIECUC6h2tlcqdlIAiSesDngUPhDe4"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="font-headline text-5xl mb-12">The Heritage Difference.</h2>
              <div className="space-y-16">
                <DifferenceItem 
                  number="01"
                  title="Pure Fiduciary Duty"
                  description="Unwavering legal and ethical obligation to act solely in your best interest. No proprietary products. No hidden agendas."
                />
                <DifferenceItem 
                  number="02"
                  title="Century-Old Stability"
                  description="Founded on the principles of endurance, we have navigated every market cycle since 1924 with steady hands."
                />
                <DifferenceItem 
                  number="03"
                  title="Tailored Solutions"
                  description="We do not believe in scale-based templates. Every family’s journey is unique and deserves a bespoke strategic roadmap."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Latest Viewpoints */}
        <section className="py-32 px-6 md:px-12 bg-surface-container-low">
          <div className="max-w-screen-2xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
              <div>
                <h2 className="font-headline text-5xl mb-4">Latest Viewpoints</h2>
                <p className="text-on-surface-variant font-body">Intellectual capital for the modern investor.</p>
              </div>
              <a className="text-primary font-label text-sm uppercase tracking-widest border-b border-primary/30 pb-1" href="#">View All Insights</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <ViewpointCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCc0L2bWyRDLKUVWdr5qSnmro5p8RHRKE-IaWsvvFWwnLMSoT9n6u0ubd3zI2ptPytDT9Id8W9nHtz2twP5dhEo9_9BGiK6YNt26bdizakiNRdY6zrH7FHj5yDYhd9n4-RDLywcsYvk08la-ZIzyallt4dytggYdOXEnyWJ7xulwqpuQvCPltN7XmtOUwCHFXNq-pfVLoHjkcviRTfdIGZWQT0g6nxhoQJ67VgP1Wz5OCKtvYtr4V1SUPnfd__3w-NpdRPIxWLSglA"
                category="Market Outlook"
                title="2024 Mid-Year Economic Forecast: Resiliency Amidst Change"
                description="Our analysis of current geopolitical shifts and their impact on long-term equity valuations."
              />
              <ViewpointCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuCSd5km7vpApaDCfaYkpJ1CvV-cogrkLoph1JzKweEMpR0PpwI274wWLy3diLGS9-_U57JsdSb_3JQuCU3O0P1wqhCuEwsnVXtw1QbVdR1dxGcU2_Cz38T9MxPkN-2S5V0z7qprMqsJAWHh65KcOaICkFZSHKkfQ-oozzQdtx_g4kWenvfj8CMhGVPLWhk71XvGcT6fQ-h_IwNvwwjY21pOYlVY2VBdzyuG8Hk1nqUIeinpM2Qy4zhBQ_877cQ1MHRgdEBeZH9ZnVA"
                category="Family Governance"
                title="The Art of The Family Meeting: Building Shared Values"
                description="Strategies for introducing the next generation to the responsibilities of stewardship."
              />
              <ViewpointCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuDm6HDORZM0TIV9A7S7cMd9bqtXImBNE4YX_UWdsnBPRwv5hsYKd8qxGNywGNfPGmJxGQpgqoYuBm2NEgEThHRUfP_X0Bk8FKv6V3Mhb-OFn4DSfuodeCSC5As_ZosV8JVhgqKbPdNrgww-vpddsJch7HAHWb827SFsSmnkoUZFUVKDA43GrMvq2imo4BHM2fUOf-wiqKbrcvYlVLivcTXHYB5elY2FxHKesIDYUCNoep0-1DAN3ReNgi5J15l4NEFRsH1iXP0cOww"
                category="Philanthropy"
                title="Strategic Giving: Impact Beyond the Transaction"
                description="How Donor Advised Funds are evolving to meet modern social challenges."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 md:px-12 bg-on-surface text-surface">
          <div className="max-w-screen-md mx-auto text-center">
            <h2 className="font-headline text-4xl mb-8">Begin Your Legacy Conversation</h2>
            <p className="text-surface/70 text-lg mb-12">Our advisors are available for a private consultation to discuss your family's unique objectives.</p>
            <button className="bg-surface text-on-surface px-12 py-4 rounded-sm font-label text-sm uppercase tracking-widest hover:bg-surface-bright transition-all">
              Inquire Online
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function ServiceCard({ icon, title, description, className }: { icon: React.ReactNode, title: string, description: string, className?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`bg-surface-container-lowest p-12 group transition-all duration-500 cursor-pointer ${className}`}
    >
      <div className="text-primary group-hover:text-surface mb-8 scale-150 transition-colors">
        {icon}
      </div>
      <h3 className="font-headline text-3xl mb-6 text-on-surface group-hover:text-surface transition-colors">{title}</h3>
      <p className="text-on-surface-variant group-hover:text-surface/80 text-lg max-w-lg mb-8 transition-colors">
        {description}
      </p>
      <a className="text-primary group-hover:text-surface font-label text-xs uppercase tracking-widest inline-flex items-center gap-2 transition-colors" href="#">
        Learn More <ArrowRight size={14} />
      </a>
    </motion.div>
  );
}

function DifferenceItem({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="flex gap-8">
      <span className="font-headline text-5xl text-outline-variant/30">{number}</span>
      <div>
        <h4 className="font-label text-sm uppercase tracking-widest text-primary mb-3">{title}</h4>
        <p className="text-on-surface-variant text-lg">{description}</p>
      </div>
    </div>
  );
}

function ViewpointCard({ image, category, title, description }: { image: string, category: string, title: string, description: string }) {
  return (
    <article className="group cursor-pointer">
      <div className="aspect-[16/10] overflow-hidden mb-6">
        <img 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={image}
          referrerPolicy="no-referrer"
        />
      </div>
      <span className="font-label text-[10px] uppercase tracking-widest text-secondary mb-3 block">{category}</span>
      <h3 className="font-headline text-2xl group-hover:text-primary transition-colors">{title}</h3>
      <p className="mt-4 text-on-surface-variant font-light line-clamp-2">{description}</p>
    </article>
  );
}

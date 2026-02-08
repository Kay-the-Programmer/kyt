
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';

gsap.registerPlugin(ScrollTrigger);

const TermsConditions: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useSEO({
        title: 'Terms and Conditions | Kytriq Technologies',
        description: 'The terms and conditions for using Kytriq Technologies services and website.',
        keywords: 'terms and conditions, legal, service agreement, Kytriq terms',
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.terms-header > *', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
            });

            gsap.utils.toArray<HTMLElement>('.terms-section').forEach((section) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 90%',
                    },
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="min-h-screen pt-32 md:pt-40 bg-white dark:bg-brand-dark transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-6 pb-20 md:pb-32">
                <header className="terms-header mb-16 md:mb-24">
                    <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6">Legal</h2>
                    <h1 className="text-4xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-8">
                        Terms & <span className="gradient-text">Conditions.</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-mono uppercase tracking-widest">
                        Last Updated: February 8, 2026
                    </p>
                </header>

                <div className="space-y-12 md:space-y-16">
                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            01. Agreement to Terms
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                By accessing our website or using our services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            02. Intellectual Property
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                The Service and its original content, features, and functionality are and will remain the exclusive property of Kytriq Technologies and its licensors.
                            </p>
                            <p>
                                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Kytriq Technologies.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            03. Use License
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                Permission is granted to temporarily download one copy of the materials on Kytriq Technologies' website for personal, non-commercial transitory viewing only.
                            </p>
                            <p>
                                This license shall automatically terminate if you violate any of these restrictions and may be terminated by Kytriq Technologies at any time.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            04. Payment Terms
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                Clients agree to the following payment schedule for all software development projects and services:
                            </p>
                            <ul className="list-none space-y-3 ml-4">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span><strong>Deposit:</strong> A non-refundable 50% upfront payment of the total project cost is required before work commences.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span><strong>Final Payment:</strong> The remaining 50% balance is due immediately upon project completion and before delivery of final assets or deployment to production.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            05. Limitation of Liability
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                In no event shall Kytriq Technologies, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </div>
                    </section>

                    <section className="terms-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            06. Governing Law
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                These Terms shall be governed and construed in accordance with the laws of <strong>Zambia</strong>, without regard to its conflict of law provisions.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default TermsConditions;

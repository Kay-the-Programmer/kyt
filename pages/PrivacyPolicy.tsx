
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Footer from '../components/Footer';
import { useSEO } from '../hooks/useSEO';

gsap.registerPlugin(ScrollTrigger);

const PrivacyPolicy: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useSEO({
        title: 'Privacy Policy | Kytriq Technologies',
        description: 'Our privacy policy explains how we collect, use, and protect your information at Kytriq Technologies.',
        keywords: 'privacy policy, data protection, Kytriq privacy',
    });

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.policy-header > *', {
                y: 40,
                opacity: 0,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
            });

            gsap.utils.toArray<HTMLElement>('.policy-section').forEach((section) => {
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
                <header className="policy-header mb-16 md:mb-24">
                    <h2 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] mb-6">Legal</h2>
                    <h1 className="text-4xl md:text-7xl font-heading font-extrabold text-gray-900 dark:text-white mb-8">
                        Privacy <span className="gradient-text">Policy.</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-mono uppercase tracking-widest">
                        Last Updated: February 8, 2026
                    </p>
                </header>

                <div className="space-y-12 md:space-y-16">
                    <section className="policy-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            01. Introduction
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                At Kytriq Technologies, we value your privacy and are committed to protecting your personal data in accordance with the <strong>Zambian Data Protection Act No. 4 of 2021</strong>. This Privacy Policy outlines how we collect, use, and safeguard your information when you interact with our website and services.
                            </p>
                            <p>
                                By using our services, you agree to the collection and use of information in accordance with this policy and Zambian data protection regulations.
                            </p>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            02. Information We Collect
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                We collect several types of information to provide and improve our services to you:
                            </p>
                            <ul className="list-none space-y-3 ml-4">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span><strong>Personal Data:</strong> Email address, name, phone number, and business details when you contact us.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span><strong>Usage Data:</strong> Information on how the service is accessed and used, including IP addresses, browser types, and page visit statistics.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span><strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            03. How We Use Your Information
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                Kytriq Technologies uses the collected data for various purposes:
                            </p>
                            <ul className="list-none space-y-3 ml-4">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span>To provide and maintain our Service.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span>To notify you about changes to our Service.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span>To provide customer support and gather analysis to improve the Service.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">/</span>
                                    <span>To monitor the usage of our Service and detect technical issues.</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            04. Data Security
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                            <p>
                                The security of your data is important to us. While we strive to use commercially acceptable means to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure.
                            </p>
                            <p>
                                We implement robust encryption and security protocols to ensure your data remains confidential and protected against unauthorized access.
                            </p>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-8 h-px bg-blue-600 mr-4"></span>
                            05. Contact Us
                        </h3>
                        <div className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            <p>
                                If you have any questions about this Privacy Policy, please contact us at:
                            </p>
                            <p className="mt-4 font-bold text-gray-900 dark:text-white">
                                legal@kytriq.com
                            </p>
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;

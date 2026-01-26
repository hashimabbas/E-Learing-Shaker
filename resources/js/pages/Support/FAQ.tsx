// resources/js/pages/Support/FAQ.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { HelpCircle } from 'lucide-react';

interface Faq {
    id: number;
    question: string;
    answer: string;
}

interface SupportFAQProps {
    faqs: Record<string, Faq[]>; // Grouped by category
}

export default function SupportFAQ({ faqs }: SupportFAQProps) {
    const categories = Object.keys(faqs);

    return (
        <AppLayout>
            <Head title="FAQ & Support" />
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold mb-4 flex items-center">
                    <HelpCircle className='w-8 h-8 mr-3' />
                    Frequently Asked Questions
                </h1>
                <p className="text-lg text-muted-foreground mb-8">Find answers to common questions about courses, payment, and account management.</p>

                {categories.map((category) => (
                    <div key={category} className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">{category}</h2>
                        <Accordion type="single" collapsible className="w-full">
                            {faqs[category].map((faq) => (
                                <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                                    <AccordionTrigger className="font-medium text-left">{faq.question}</AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground whitespace-pre-wrap">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}

                <Card className="mt-12 text-center">
                    <CardContent className="pt-6">
                        <CardTitle className="text-xl mb-2">Still can't find your answer?</CardTitle>
                        <p className="text-muted-foreground mb-4">Contact our support team directly for complex issues.</p>
                        <Link href={route('support.contact')}>
                            <Button size="lg">Contact Support</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

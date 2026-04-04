import React, { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

export const AegixRegistration: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log('Form submitted:', formData);
    setSubmitSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({ firstName: '', lastName: '', email: '', company: '' });
      setSubmitSuccess(false);
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="register" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`bg-card border border-border rounded-3xl p-8 md:p-12 ${
            isVisible ? 'animate-fade-in-up' : 'opacity-0'
          }`}
        >
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
            Register Now - It's Free
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Join the webinar and learn how to protect your business
          </p>

          {/* Form */}
          {!submitSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                  First Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-background border ${
                    errors.firstName ? 'border-destructive' : 'border-border'
                  } rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-colors`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-destructive">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                  Last Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-background border ${
                    errors.lastName ? 'border-destructive' : 'border-border'
                  } rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-colors`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-destructive">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-background border ${
                    errors.email ? 'border-destructive' : 'border-border'
                  } rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-colors`}
                  placeholder="john@company.com"
                />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>

              {/* Company Name (Optional) */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
                  placeholder="Your Company"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-brand text-white font-bold rounded-full hover:bg-brand/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
              >
                {isSubmitting ? 'Submitting...' : 'Register for Free'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-brand mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-foreground mb-2">Registration Successful!</h3>
              <p className="text-muted-foreground">
                Check your email for the webinar access link.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

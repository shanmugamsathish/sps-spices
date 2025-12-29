import React, { useState, useCallback } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import theme from "../../lib/theme";
import toast from "react-hot-toast";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validation
      if (
        !formData.name?.trim() ||
        !formData.email?.trim() ||
        !formData.message?.trim()
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setIsSubmitting(true);

      // Simulate API call - replace with actual API call
      try {
        // TODO: Replace with actual API endpoint
        // const response = await sendContactMessage(formData);

        // Simulate delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast.success("Message sent successfully! We'll get back to you soon.");
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Reset success state after 3 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "spsspices@zohomail.in",
      link: "mailto:spsspices@zohomail.in",
    },
    {
      icon: Phone,
      title: "Call Us / WhatsApp",
      content: "+91 7092597277",
      link: "https://wa.me/917092597277",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content:
        "C2 NAAZYAS ARCADE 4th Main Road Maharaja Nagar Palayamkottai - 627011",
      link: "https://maps.app.goo.gl/DwYRXFQjf9hXqsBj9",
    },
  ];

  return (
    <div
      className="min-h-screen py-8 px-4 sm:px-6 md:px-8"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.colors.text.primary }}
          >
            Get in Touch
          </h1>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: theme.colors.text.secondary }}
          >
            We welcome inquiries, collaborations, and bulk orders. Our team is
            available to assist with professionalism and care.{" "}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Left Panel - Contact Information */}
          <motion.div variants={itemVariants} className="space-y-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-lg shadow-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-6"
                style={{ color: theme.colors.text.primary }}
              >
                Contact Information
              </h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <motion.a
                      key={index}
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <div
                        className="p-3 rounded-lg shrink-0 transition-colors"
                        style={{
                          backgroundColor: theme.colors.accent.primary,
                          color: "#FFFFFF",
                        }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {info.title}
                        </h3>
                        <p
                          className="text-sm group-hover:underline"
                          style={{ color: theme.colors.text.secondary }}
                        >
                          {info.content}
                        </p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Business Hours */}
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="p-8 rounded-lg shadow-sm"
              style={{
                backgroundColor: "#FFFFFF",
                border: `1px solid ${theme.colors.border.light}`,
              }}
            >
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: theme.colors.text.primary }}
              >
                Business Hours
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text.secondary }}>
                    Monday - Friday
                  </span>
                  <span
                    style={{
                      color: theme.colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    9:00 AM - 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text.secondary }}>
                    Saturday
                  </span>
                  <span
                    style={{
                      color: theme.colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    10:00 AM - 4:00 PM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text.secondary }}>
                    Sunday
                  </span>
                  <span
                    style={{
                      color: theme.colors.text.primary,
                      fontWeight: 500,
                    }}
                  >
                    Closed
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Panel - Contact Form */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-lg shadow-sm"
            style={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <h2
              className="text-2xl font-semibold mb-6"
              style={{ color: theme.colors.text.primary }}
            >
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                    focusRingColor: theme.colors.accent.primary,
                  }}
                  placeholder="Your full name"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme.colors.background.main,
                      borderColor: theme.colors.border.light,
                      color: theme.colors.text.primary,
                    }}
                    placeholder="your.email@example.com"
                  />
                </motion.div>

                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: theme.colors.background.main,
                      borderColor: theme.colors.border.light,
                      color: theme.colors.text.primary,
                    }}
                    placeholder="+91 98765 43210"
                  />
                </motion.div>
              </div>

              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="What's this regarding?"
                />
              </motion.div>

              <motion.div
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-all resize-none"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderColor: theme.colors.border.light,
                    color: theme.colors.text.primary,
                  }}
                  placeholder="Tell us how we can help you..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: isSubmitted
                    ? "#10B981"
                    : theme.colors.accent.primary,
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && !isSubmitted) {
                    e.target.style.backgroundColor = theme.colors.accent.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && !isSubmitted) {
                    e.target.style.backgroundColor =
                      theme.colors.accent.primary;
                  }
                }}
              >
                {isSubmitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Contact;

import { useState } from "react";

import {
  FiArrowRight,
  FiArrowUpRight,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiMapPin,
  FiSearch,
  FiShield,
  FiStar,
  FiUsers,
  FiZap,
} from "react-icons/fi";

import Header from "../components/Header";
import Footer from "../components/Footer";
import AppDownload from "../components/AppDownload";
import Reveal from "../components/Reveal";


/* =====================================================
   DATA
===================================================== */

const services = [
  {
    title: "Cleaning",
    icon: "🧹",
    description:
      "Find reliable professionals for homes, offices and commercial spaces.",
  },
  {
    title: "Plumbing",
    icon: "🔧",
    description:
      "Connect with skilled plumbers for repairs, installations and maintenance.",
  },
  {
    title: "Electrical",
    icon: "⚡",
    description:
      "Find professionals for electrical installations, repairs and maintenance.",
  },
  {
    title: "Painting",
    icon: "🎨",
    description:
      "Transform your space with experienced painting professionals.",
  },
  {
    title: "Carpentry",
    icon: "🪚",
    description:
      "Get skilled carpenters for furniture, repairs and custom work.",
  },
  {
    title: "Moving",
    icon: "📦",
    description:
      "Make moving easier with professionals ready to help.",
  },
  {
    title: "AC & Cooling",
    icon: "❄️",
    description:
      "Find technicians for AC installation, servicing and repairs.",
  },
  {
    title: "Maintenance",
    icon: "🛠️",
    description:
      "Get help with everyday maintenance and property repairs.",
  },
];

const customerBenefits = [
  "Discover professionals in one place",
  "Compare your service options",
  "Connect directly with providers",
  "Save time searching for help",
  "Manage your service requests",
];

const providerBenefits = [
  "Create your professional profile",
  "Showcase your skills and services",
  "Reach customers looking for your services",
  "Grow your professional network",
  "Build your reputation on Mavero",
];

const testimonials = [
  {
    name: "Michael Johnson",
    role: "Mavero Customer",
    text:
      "Finding someone to handle a home repair used to take me days. Mavero made the process much easier.",
  },
  {
    name: "Sarah Williams",
    role: "Service Provider",
    text:
      "Mavero gives professionals another way to put their services in front of people who actually need them.",
  },
  {
    name: "David Carter",
    role: "Mavero Customer",
    text:
      "I like having different service options available in one place instead of asking friends for recommendations every time.",
  },
];

const faqs = [
  {
    question:
      "What is Mavero?",
    answer:
      "Mavero is a professional services platform designed to connect customers with service providers for a wide range of everyday services.",
  },
  {
    question:
      "Who can use Mavero?",
    answer:
      "Anyone looking for professional services can use Mavero. Skilled professionals can also join the platform to showcase their services and connect with potential customers.",
  },
  {
    question:
      "How do I find a service provider?",
    answer:
      "Download the Mavero app, choose the service you need and explore available service providers.",
  },
  {
    question:
      "Can I become a service provider?",
    answer:
      "Yes. Professionals can create a profile, showcase their services and connect with customers through the platform.",
  },
  {
    question:
      "Where can I download Mavero?",
    answer:
      "Mavero is available through the Google Play Store and Apple App Store.",
  },
];


/* =====================================================
   SECTION LABEL
===================================================== */

function SectionLabel({ children }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
      <span className="h-px w-7 bg-[#C9A227]" />
      {children}
    </div>
  );
}


/* =====================================================
   HERO
===================================================== */

function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white pt-32 lg:pt-40"
    >
      {/* Background decorations */}
      <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-blue-50 blur-3xl" />

      <div className="absolute left-0 top-80 h-72 w-72 rounded-full bg-[#C9A227]/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">

          {/* Content */}
          <Reveal direction="left">
            <div>
              <h1 className="max-w-3xl text-5xl font-black leading-[1] tracking-tight text-[#004687] sm:text-6xl lg:text-7xl">
                Find the right
                <br />

                <span className="text-[#C9A227]">
                  professional.
                </span>

                <br />

                Get the job done.
              </h1>

              <p className="mt-7 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                Mavero connects you with professional
                service providers for the jobs that matter.
                From everyday tasks to specialized services,
                discover the people you need in one place.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">

                <a
                  href="#download"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#004687] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-blue-900 hover:shadow-xl"
                >
                  Find A Professional

                  <FiArrowUpRight
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>

                <a
                  href="#providers"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 px-6 py-3.5 text-xs font-bold text-[#004687] transition hover:border-[#C9A227] hover:text-[#A88712]"
                >
                  Join As A Provider
                </a>

              </div>

              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">

                {[
                  "Professional services",
                  "Easy to use",
                  "One convenient platform",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-[10px] font-medium text-gray-500"
                  >
                    <FiCheck
                      className="text-[#C9A227]"
                    />

                    {item}
                  </div>
                ))}

              </div>

            </div>
          </Reveal>


          {/* Hero image */}
          <Reveal
            direction="right"
            delay={150}
          >
            <div className="relative">

              <div className="overflow-hidden rounded-[2rem] bg-blue-100 shadow-2xl shadow-blue-950/10">

                <img
                  src="https://i.pinimg.com/1200x/03/fe/80/03fe80dbeeb576549154b2773565c796.jpg"
                  alt="Professional service provider"
                  className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
                />

              </div>


              {/* Floating search card */}
              <div className="absolute bottom-[-5px] left-[-30px] right-5 rounded-xl border border-gray-100 bg-white p-4 shadow-2xl sm:left-7 sm:right-auto sm:w-[350px]">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-900">
                    <FiSearch />
                  </div>

                  <div>
                    <p className="text-[9px] font-medium text-gray-400">
                      WHAT DO YOU NEED?
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-950">
                      Find a professional near you
                    </p>
                  </div>

                  <FiArrowRight className="ml-auto text-[#C9A227]" />

                </div>

              </div>


              {/* Trust badge */}
              <div className="absolute right-5 top-5 rounded-2xl border border-white bg-white/95 px-4 py-3 shadow-xl">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                    <FiShield size={14} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-blue-950">
                      Built for trust
                    </p>

                    <p className="text-[8px] text-gray-400">
                      Professional services
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}


/* =====================================================
   STATS
===================================================== */

function Stats() {
  const stats = [
    ["10K+", "Customers"],
    ["2K+", "Service Providers"],
    ["50+", "Service Categories"],
    ["4.9/5", "User Experience"],
  ];

  return (
    <section className="mt-20 border-y border-blue-100 bg-[#004687] py-10">

      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">

        {stats.map(
          ([number, label], index) => (
            <Reveal
              key={label}
              delay={index * 80}
            >
              <div className="border-r border-white/10 px-5 py-4 text-center last:border-r-0">

                <p className="text-3xl font-black text-white">
                  {number}
                </p>

                <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-blue-200">
                  {label}
                </p>

              </div>
            </Reveal>
          )
        )}

      </div>

    </section>
  );
}


/* =====================================================
   PROBLEM
===================================================== */

function ProblemSection() {
  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <Reveal direction="left">

            <div>

              <SectionLabel>
                The Problem
              </SectionLabel>

              <h2 className="text-4xl font-black leading-tight text-[#004687] sm:text-5xl">
                Finding the right
                <br />
                person shouldn't
                <br />
                be{" "}
                <span className="text-[#C9A227]">
                  difficult.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-gray-500">
                Finding someone reliable for a job can
                mean asking friends, searching social media,
                making endless phone calls or simply hoping
                the person you find can actually do the work.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
                Mavero brings customers and professionals
                together through one platform designed to
                make the process easier.
              </p>

            </div>

          </Reveal>


          <Reveal direction="right">

            <div className="grid gap-4 sm:grid-cols-2">

              {[
                {
                  icon: <FiSearch />,
                  title: "Stop searching everywhere",
                  text: "Find service options in one place.",
                },
                {
                  icon: <FiUsers />,
                  title: "Connect directly",
                  text: "Get closer to the people who can help.",
                },
                {
                  icon: <FiClock />,
                  title: "Save valuable time",
                  text: "Spend less time looking and more time getting things done.",
                },
                {
                  icon: <FiZap />,
                  title: "Make things simpler",
                  text: "A simpler way to discover professional services.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-900 shadow-sm">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-sm font-bold text-[#004687]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    {item.text}
                  </p>

                </div>
              ))}

            </div>

          </Reveal>

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   HOW IT WORKS
===================================================== */

function HowItWorks() {

  const steps = [
    {
      number: "01",
      title: "Choose what you need",
      text: "Tell Mavero the service you're looking for.",
      icon: <FiSearch />,
    },
    {
      number: "02",
      title: "Discover professionals",
      text: "Explore service providers that match your needs.",
      icon: <FiUsers />,
    },
    {
      number: "03",
      title: "Connect & get started",
      text: "Connect with your chosen professional and move forward.",
      icon: <FiCheck />,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-blue-50/50 py-24"
    >

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <Reveal>

          <div className="mx-auto max-w-2xl text-center">

            <SectionLabel>
              How Mavero Works
            </SectionLabel>

            <h2 className="text-4xl font-black text-[#004687] sm:text-5xl">
              Simple from
              <span className="text-[#C9A227]">
                {" "}start to finish.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              We remove unnecessary complexity from
              finding and offering professional services.
            </p>

          </div>

        </Reveal>


        <div className="mt-14 grid gap-5 md:grid-cols-3">

          {steps.map((step, index) => (

            <Reveal
              key={step.number}
              delay={index * 100}
            >

              <div className="group relative rounded-3xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#004687] text-white">
                    {step.icon}
                  </div>

                  <span className="text-5xl font-black text-blue-50">
                    {step.number}
                  </span>

                </div>

                <h3 className="mt-8 text-lg font-bold text-[#004687]">
                  {step.title}
                </h3>

                <p className="mt-3 text-xs leading-6 text-gray-500">
                  {step.text}
                </p>

              </div>

            </Reveal>

          ))}

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   CUSTOMER SECTION
===================================================== */

function Customers() {
  return (
    <section
      id="customers"
      className="bg-white py-24"
    >

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <Reveal direction="left">

            <div className="relative">

              <img
                src="https://i.pinimg.com/736x/cc/ee/96/ccee968f42ea7a8b59c3f123a00f0594.jpg"
                alt="Customer and professional"
                className="h-[500px] w-full rounded-[2rem] object-cover"
              />

              <div className="absolute bottom-6 left-6 rounded-2xl bg-white p-5 shadow-2xl">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
                    <FiStar fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#004687]">
                      Better connections
                    </p>

                    <p className="text-[9px] text-gray-400">
                      Better service experiences
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </Reveal>


          <Reveal direction="right">

            <div>

              <SectionLabel>
                For Customers
              </SectionLabel>

              <h2 className="text-4xl font-black leading-tight text-[#004687] sm:text-5xl">
                Need a job done?
                <br />

                <span className="text-[#C9A227]">
                  Start with Mavero.
                </span>
              </h2>

              <p className="mt-6 text-sm leading-7 text-gray-500">
                Your time matters. Instead of spending hours
                looking for someone who can help, use Mavero
                to discover professional service providers.
              </p>

              <div className="mt-8 space-y-4">

                {customerBenefits.map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 text-xs font-medium text-gray-600"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800">
                        <FiCheck size={12} />
                      </span>

                      {benefit}
                    </div>
                  )
                )}

              </div>

              <a
                href="#download"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#004687] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-blue-900"
              >
                Find A Professional

                <FiArrowUpRight />
              </a>

            </div>

          </Reveal>

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   PROVIDER SECTION
===================================================== */

function Providers() {
  return (
    <section
      id="providers"
      className="overflow-hidden bg-gray-800 py-24 text-white"
    >

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <Reveal direction="left">

            <div>

              <SectionLabel>
                For Service Providers
              </SectionLabel>

              <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                Your skills are
                <br />
                valuable.
                <br />

                <span className="text-[#C9A227]">
                  Let people find you.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-blue-100">
                Whether you're a skilled technician,
                tradesperson, freelancer or service
                professional, Mavero gives you a place
                to showcase what you do and reach people
                who need your services.
              </p>

              <div className="mt-8 space-y-4">

                {providerBenefits.map(
                  (benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-3 text-xs text-blue-100"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#C9A227]">
                        <FiCheck size={12} />
                      </span>

                      {benefit}
                    </div>
                  )
                )}

              </div>

              <a
                href="#download"
                className="mt-9 inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#B38F18]"
              >
                Become A Provider

                <FiArrowUpRight />
              </a>

            </div>

          </Reveal>


          <Reveal direction="right">

            <div className="relative">

              <div className="overflow-hidden rounded-[2rem] border border-white/10">

                <img
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=90"
                  alt="Professional service provider"
                  className="h-[500px] w-full object-cover"
                />

              </div>

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white p-5 text-blue-950 shadow-2xl">

                <div className="flex items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C9A227]/10 text-[#C9A227]">
                    <FiBriefcase />
                  </div>

                  <div>

                    <p className="text-sm font-black">
                      Turn your expertise into opportunity.
                    </p>

                    <p className="mt-1 text-[9px] leading-4 text-gray-500">
                      Join Mavero and put your professional
                      services in front of potential customers.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   SERVICES
===================================================== */

function Services() {
  return (
    <section
      id="services"
      className="bg-white py-24"
    >

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <Reveal>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

            <div>

              <SectionLabel>
                Explore Services
              </SectionLabel>

              <h2 className="text-4xl font-black text-[#004687] sm:text-5xl">
                Whatever the job,
                <br />

                <span className="text-[#C9A227]">
                  find someone for it.
                </span>
              </h2>

            </div>

            <p className="max-w-md text-xs leading-6 text-gray-500">
              From everyday household services to
              specialized professional work, Mavero
              makes discovering service providers easier.
            </p>

          </div>

        </Reveal>


        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {services.map(
            (service, index) => (

              <Reveal
                key={service.title}
                delay={index * 60}
              >

                <div className="group rounded-2xl border border-blue-100 bg-white p-6 transition duration-300 hover:-translate-y-2 hover:border-[#C9A227]/40 hover:shadow-xl">

                  <div className="flex items-center justify-between">

                    <span className="text-3xl">
                      {service.icon}
                    </span>

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-900 transition group-hover:bg-[#C9A227] group-hover:text-white">
                      <FiArrowUpRight />
                    </div>

                  </div>

                  <h3 className="mt-6 text-base font-bold text-[#004687]">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-[10px] leading-5 text-gray-500">
                    {service.description}
                  </p>

                </div>

              </Reveal>

            )
          )}

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   WHY Mavero
===================================================== */

function WhyMavero() {

  const features = [
    {
      icon: <FiShield />,
      title: "Trust",
      text: "Create better service experiences through a platform built around customers and professionals.",
    },
    {
      icon: <FiUsers />,
      title: "Connection",
      text: "Bring customers and service providers together in one convenient environment.",
    },
    {
      icon: <FiSearch />,
      title: "Discovery",
      text: "Make it easier for customers to discover services and professionals.",
    },
    {
      icon: <FiZap />,
      title: "Convenience",
      text: "Spend less time searching and more time getting things done.",
    },
  ];

  return (
    <section className="bg-blue-50/50 py-24">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <Reveal>

          <div className="mx-auto max-w-2xl text-center">

            <SectionLabel>
              Why Mavero
            </SectionLabel>

            <h2 className="text-4xl font-black text-[#004687] sm:text-5xl">
              One platform.
              <br />

              <span className="text-[#C9A227]">
                More possibilities.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Mavero is designed to create a simpler
              connection between people who need services
              and professionals who provide them.
            </p>

          </div>

        </Reveal>


        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {features.map(
            (feature, index) => (

              <Reveal
                key={feature.title}
                delay={index * 80}
              >

                <div className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#004687] text-white">
                    {feature.icon}
                  </div>

                  <h3 className="mt-6 font-bold text-[#004687]">
                    {feature.title}
                  </h3>

                  <p className="mt-3 text-[10px] leading-5 text-gray-500">
                    {feature.text}
                  </p>

                </div>

              </Reveal>

            )
          )}

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   PROVIDER CTA
===================================================== */

function ProviderCTA() {
  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <Reveal>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#C9A227] px-7 py-12 sm:px-12 lg:px-16">

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">

              <div className="max-w-2xl">

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Are you a professional?
                </p>

                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Don't just wait for customers.
                  <br />
                  Put your services where they can find you.
                </h2>

                <p className="mt-5 text-sm leading-6 text-white/80">
                  Join Mavero, create your professional
                  presence and start building new opportunities.
                </p>

              </div>

              <a
                href="#download"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#004687] px-7 py-4 text-xs font-bold text-white transition hover:bg-blue-900"
              >
                Join Mavero

                <FiArrowUpRight />
              </a>

            </div>

          </div>

        </Reveal>

      </div>

    </section>
  );
}


/* =====================================================
   APP DOWNLOAD
===================================================== */

function DownloadSection() {
  return (
    <section
      id="download"
      className="overflow-hidden bg-gray-800 py-24 text-white"
    >

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          <Reveal direction="left">

            <div>

              <SectionLabel>
                Download Mavero
              </SectionLabel>

              <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                Your next service
                <br />

                <span className="text-[#C9A227]">
                  starts here.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-blue-100">
                Download the Mavero app to discover
                professional services, connect with providers
                and manage your service experience wherever
                you are.
              </p>

              <div className="mt-8">
                <AppDownload />
              </div>

              <p className="mt-5 text-[10px] text-blue-300">
                Available on Android and iOS.
              </p>

            </div>

          </Reveal>


          <Reveal direction="right">

            <div className="flex justify-center lg:justify-end">

              <div className="relative">

                {/* Phone */}
                <div className="h-[500px] w-[250px] overflow-hidden rounded-[2.8rem] border-[7px] border-[#004687] bg-white shadow-2xl">

                  <div className="h-full">

                    <div className="bg-[#C9A227] px-5 pb-8 pt-12">

                      <p className="text-[9px] font-medium text-white/80">
                        WELCOME TO
                      </p>

                      <h3 className="mt-1 text-2xl font-black text-white">
                        Mavero
                      </h3>

                    </div>

                    <div className="space-y-3 p-4">

                      <div className="rounded-xl bg-blue-50 p-3">
                        <p className="text-[8px] text-gray-400">
                          SEARCH SERVICES
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <FiSearch
                            size={13}
                            className="text-blue-900"
                          />

                          <span className="text-[10px] font-semibold text-blue-950">
                            What do you need?
                          </span>
                        </div>
                      </div>

                      {[
                        "Cleaning",
                        "Plumbing",
                        "Electrical",
                        "Painting",
                        "Maintenance",
                      ].map((service) => (

                        <div
                          key={service}
                          className="flex items-center justify-between rounded-xl border border-gray-100 p-3"
                        >

                          <span className="text-[10px] font-semibold text-blue-950">
                            {service}
                          </span>

                          <FiArrowRight
                            size={12}
                            className="text-[#C9A227]"
                          />

                        </div>

                      ))}

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </Reveal>

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   TESTIMONIALS
===================================================== */

function Testimonials() {

  const [active, setActive] =
    useState(0);

  const testimonial =
    testimonials[active];

  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-4xl px-5 text-center lg:px-8">

        <Reveal>

          <SectionLabel>
            Customer Stories
          </SectionLabel>

          <h2 className="text-4xl font-black text-[#004687]">
            Built for people.
            <br />

            <span className="text-[#C9A227]">
              Trusted by people.
            </span>
          </h2>

        </Reveal>


        <Reveal delay={100}>

          <div className="mt-12 rounded-[2rem] bg-blue-50 p-8 sm:p-12">

            <div className="flex justify-center gap-1 text-[#C9A227]">

              {[1, 2, 3, 4, 5].map(
                (star) => (
                  <FiStar
                    key={star}
                    fill="currentColor"
                    size={15}
                  />
                )
              )}

            </div>

            <p className="mx-auto mt-7 max-w-2xl text-lg font-medium leading-8 text-[#004687] sm:text-xl">
              "{testimonial.text}"
            </p>

            <div className="mt-8">

              <h3 className="text-sm font-bold text-[#004687]">
                {testimonial.name}
              </h3>

              <p className="mt-1 text-[10px] text-gray-500">
                {testimonial.role}
              </p>

            </div>


            <div className="mt-8 flex justify-center gap-2">

              <button
                onClick={() =>
                  setActive(
                    (active -
                      1 +
                      testimonials.length) %
                      testimonials.length
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 text-[#004687] transition hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                <FiChevronLeft />
              </button>

              <button
                onClick={() =>
                  setActive(
                    (active + 1) %
                      testimonials.length
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#004687] text-white transition hover:bg-blue-900"
              >
                <FiChevronRight />
              </button>

            </div>

          </div>

        </Reveal>

      </div>

    </section>
  );
}


/* =====================================================
   FAQ
===================================================== */

function FAQ() {

  const [open, setOpen] =
    useState(null);

  return (
    <section className="bg-blue-50/50 py-24">

      <div className="mx-auto max-w-4xl px-5 lg:px-8">

        <Reveal>

          <div className="text-center">

            <SectionLabel>
              Frequently Asked Questions
            </SectionLabel>

            <h2 className="text-4xl font-black text-[#004687]">
              Questions?
              <br />

              <span className="text-[#C9A227]">
                We've got answers.
              </span>
            </h2>

          </div>

        </Reveal>


        <div className="mt-12 space-y-3">

          {faqs.map(
            (faq, index) => {

              const isOpen =
                open === index;

              return (
                <Reveal
                  key={faq.question}
                  delay={index * 50}
                >

                  <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">

                    <button
                      onClick={() =>
                        setOpen(
                          isOpen
                            ? null
                            : index
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                    >

                      <span className="text-sm font-bold text-[#004687]">
                        {faq.question}
                      </span>

                      <FiChevronDown
                        className={`shrink-0 text-[#C9A227] transition ${
                          isOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                    </button>

                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >

                      <div className="overflow-hidden">

                        <p className="border-t border-blue-50 px-6 pb-6 pt-4 text-xs leading-6 text-gray-500">
                          {faq.answer}
                        </p>

                      </div>

                    </div>

                  </div>

                </Reveal>
              );
            }
          )}

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   FINAL CTA
===================================================== */

function FinalCTA() {
  return (
    <section className="bg-white py-20">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <Reveal>

          <div className="relative overflow-hidden rounded-[2rem] bg-[#004687] px-7 py-14 text-center sm:px-12">

            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#C9A227]/10 blur-3xl" />

            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-700/30 blur-3xl" />

            <div className="relative">

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#C9A227]">
                Your next step starts here
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black text-white sm:text-5xl">
                Need a professional?
                <br />
                Or are you one?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-blue-200">
                Whatever side of the service you are on,
                Mavero is built to help you move forward.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">

                <a
                  href="#download"
                  className="rounded-full bg-[#C9A227] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#B38F18]"
                >
                  Find A Professional
                </a>

                <a
                  href="#providers"
                  className="rounded-full border border-white/20 px-6 py-3.5 text-xs font-bold text-white transition hover:border-[#C9A227]"
                >
                  Become A Provider
                </a>

              </div>

            </div>

          </div>

        </Reveal>

      </div>

    </section>
  );
}


/* =====================================================
   LANDING
===================================================== */

export default function Landing() {
  return (
    <>
      <Header />

      <main>

        <Hero />

        <Stats />

        <ProblemSection />

        <HowItWorks />

        <Customers />

        <Providers />

        <Services />

        <WhyMavero />

        <ProviderCTA />

        <DownloadSection />

        <Testimonials />

        <FAQ />

        <FinalCTA />

      </main>

      <Footer />
    </>
  );
}
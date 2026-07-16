import type { LucideIcon } from "lucide-react";
import {
  Award,
  Briefcase,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  Laptop,
  MessageCircle,
  MessagesSquare,
  Mic,
  Presentation,
  Repeat,
  Rocket,
  Search,
  Smile,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Users
} from "lucide-react";

export const programImages = {
  hero: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=1400&q=85",
  concept: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1300&q=85",
  child: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1300&q=85",
  contact: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1300&q=85"
};

export const programBrand = {
  company: "Excelsus Techno Solutions Pvt. Ltd.",
  name: "Perfect Man",
  childName: "Perfect Child",
  subtitle: "Human Excellence & Personality Transformation Program",
  positioning: "Human Excellence & Skill Development Centre",
  tagline: "Identify. Improve. Transform.",
  transformLine: "Transform Yourself. Transform Your Future.",
  taglineSub:
    "Recognise every child's talent, work on their weaknesses, and prepare them for the future.",
  ageGroup: "Age Group: 8–18 Years",
  focusChips: ["Self-Confidence", "Communication", "Leadership", "Discipline", "Practical Skills"]
};

export const programConcept = {
  general:
    "A short-duration human development program that identifies every person's weaknesses and develops their personality, confidence, communication, leadership, discipline, and practical skills.",
  child:
    "Every child is different. One child may lack confidence, another may have stage fear, and others may need help with communication, discipline, focus, or leadership skills.",
  childApproach:
    "The Perfect Child Program begins with a Personal Development Assessment of the child, followed by practical activities and training designed around their individual needs."
};

export type ProgramFormat = {
  title: string;
  schedule: string;
  icon: LucideIcon;
};

export const programFormats: ProgramFormat[] = [
  { title: "Daily Program", schedule: "1–2 Hours Daily", icon: CalendarClock },
  { title: "Weekend Program", schedule: "Saturday & Sunday", icon: CalendarDays },
  { title: "Crash Program", schedule: "7–15 Days", icon: Timer },
  { title: "Complete Transformation", schedule: "1–3 Months", icon: TrendingUp }
];

export type ProgramOption = {
  program: string;
  duration: string;
  suitableFor: string;
};

export const programOptions: ProgramOption[] = [
  {
    program: "7-Day Starter Program",
    duration: "1–2 Hours Daily",
    suitableFor: "Quick Confidence Boost"
  },
  {
    program: "15-Day Development Program",
    duration: "1–2 Hours Daily",
    suitableFor: "Personality & Communication Development"
  },
  {
    program: "4-Weekend Program",
    duration: "Saturday & Sunday",
    suitableFor: "School-going Children"
  },
  {
    program: "30-Day Transformation Program",
    duration: "Flexible Sessions",
    suitableFor: "Complete Development"
  }
];

export type TrainingModule = {
  title: string;
  icon: LucideIcon;
  points: string[];
};

export const trainingModules: TrainingModule[] = [
  {
    title: "Fear Management & Confidence Training",
    icon: Mic,
    points: [
      "Stage fear",
      "Public speaking fear",
      "Failure and rejection management",
      "Self-confidence building",
      "Decision-making confidence"
    ]
  },
  {
    title: "Leadership & Communication Training",
    icon: MessagesSquare,
    points: [
      "Leadership mindset",
      "Effective communication",
      "Public speaking",
      "Team management",
      "Conflict management",
      "Negotiation skills"
    ]
  },
  {
    title: "Personality Development",
    icon: Sparkles,
    points: [
      "Body language",
      "Grooming and presentation",
      "Positive attitude",
      "Discipline and etiquette",
      "Emotional intelligence"
    ]
  },
  {
    title: "Life & Career Skills",
    icon: Target,
    points: [
      "Time management",
      "Goal setting",
      "Problem solving",
      "Stress management",
      "Financial awareness",
      "Career planning"
    ]
  },
  {
    title: "Professional & Digital Skills",
    icon: Laptop,
    points: [
      "Computer and AI skills",
      "Interview preparation",
      "Resume building",
      "Sales and marketing",
      "Entrepreneurship",
      "Workplace skills"
    ]
  },
  {
    title: "Individual Weakness Assessment",
    icon: ClipboardCheck,
    points: [
      "Personal assessment of every participant",
      "Identification of weaknesses and strengths",
      "A Personal Improvement Roadmap for each participant"
    ]
  }
];

export type TrainingStep = {
  label: string;
  icon: LucideIcon;
};

export const trainingModel: TrainingStep[] = [
  { label: "Assess", icon: ClipboardList },
  { label: "Identify Gaps", icon: Search },
  { label: "Train", icon: Presentation },
  { label: "Practice", icon: Repeat },
  { label: "Evaluate", icon: ClipboardCheck },
  { label: "Transform", icon: Rocket }
];

export const trainingModelNote =
  "Every child gets a Personal Assessment at the start and a Progress Evaluation at the end of the program.";

export type ChildLearning = {
  title: string;
  copy: string;
};

export const childLearnings: ChildLearning[] = [
  {
    title: "Confidence & Fear Management",
    copy: "Stage fear, public speaking fear, self-confidence, and failure handling."
  },
  {
    title: "Communication & Public Speaking",
    copy: "Clear speaking, conversation skills, presentation, and effective communication."
  },
  {
    title: "Leadership & Teamwork",
    copy: "Leadership mindset, teamwork, responsibility, and decision-making."
  },
  {
    title: "Personality & Discipline",
    copy: "Body language, grooming, etiquette, positive attitude, and self-discipline."
  },
  {
    title: "Focus & Life Skills",
    copy: "Time management, goal setting, problem-solving, emotional intelligence, and stress management."
  },
  {
    title: "Digital & Future Skills",
    copy: "Basic computer skills, responsible AI awareness, creativity, presentation, and future-ready skills."
  }
];

export const parentReasons = [
  "Short-duration & practical training",
  "Activity-based learning",
  "Individual development assessment",
  "Small-group interaction",
  "Confidence-building activities",
  "Public speaking practice",
  "Leadership & teamwork activities",
  "Parent progress feedback"
];

export type ProgramOutcome = {
  label: string;
  icon: LucideIcon;
};

export const programOutcomes: ProgramOutcome[] = [
  { label: "More Confident", icon: Smile },
  { label: "Better Communicator", icon: MessageCircle },
  { label: "Strong Leader", icon: Users },
  { label: "Disciplined & Focused", icon: Target },
  { label: "Skilled & Professional", icon: Briefcase },
  { label: "Success Ready", icon: Award }
];

export const positioningQuote =
  "A training centre where a person's weaknesses are identified and they are shaped into a confident, skilled, disciplined, impactful, and leadership-ready individual.";

export const admissionsCta = {
  headline: "Give Your Child Skills for Life, Not Just Marks.",
  graduationIcon: GraduationCap,
  phone: "+91 744-7882508",
  phoneHref: "tel:+917447882508",
  email: "Info@Businessexperts.Asia",
  emailHref: "mailto:Info@Businessexperts.Asia",
  website: "Businessexperts.Asia",
  websiteHref: "https://businessexperts.asia",
  address:
    "C Wing 213, Geavity Commercial Complex, Exit Road to Service Rd, Patil Nagar, Balewadi, Pune, Maharashtra – 411045"
};

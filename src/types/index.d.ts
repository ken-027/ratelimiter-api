import { SessionData } from "express-session";
import { Request } from "express";

export interface Chat {
    message: string;
}

export interface Email {
    name: string;
    subject: string;
    email: string;
    message: string;
}

export interface Certificate {
    name: string;
    platform: string;
    platformLogo?: string;
    dateCompleted: Date | "ongoing";
    description: string;
    certificateLink?: string;
    certificateImage?: string;
    courseLink?: string;
}

export interface Contact {
    name: string;
    link: string;
}

export interface Experience {
    title: string;
    company: string;
    location: string;
    startDate: Date;
    endDate: Date | "Present";
    descriptions: string[];
    companyLogo?: string;
    projects?: Project[];
}

export type Category = "fullstack" | "frontend" | "backend";

export type ProjectType = "personal" | "freelance" | "company";

export interface Project {
    thumbnailLink?: string;
    title: string;
    description: string;
    technologies: ItemSkill[];
    githubRepo?: string;
    liveDemo?: string;
    screenshot?: string;
    category: Category;
    type: ProjectType;
    aiPowered?: boolean;
}

export const CATEGORIES: Category[] = ["frontend", "backend", "fullstack"];

export type ProjectName =
    | "casa"
    | "casa_api"
    | "fixed_asset"
    | "portfolio"
    | "dashboard"
    | "job_posting"
    | "invoice_crud"
    | "wiwo"
    | "libre"
    | "educat"
    | "agency_match"
    | "trabook"
    | "e_commerce"
    | "mta"
    | "llda"
    | "csrm"
    | "csrm_api"
    | "ema"
    // | "recipe_api"
    // | "order_api"
    | "rustify"
    | "anime_dialog_translator"
    | "py_to_any"
    | "portfolio_api"
    | "portfolio_terminal";

export interface Service {
    title: string;
    description: string;
    image: string;
}

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Proficiency = "confident" | "comfortable" | "exploring";

export interface ItemSkill {
    name: string;
    level: Level;
    proficiency: Proficiency;
    icon: string;
}

export interface Skill {
    name: string;
    items: ItemSkill[];
}

export interface SessionMessage {
    role: "user" | "assistant";
    content: string;
}
export interface SessionMessages extends SessionData {
    messages?: SessionMessage[];
}

export type SessionRequest = Request & {
    session: SessionMessages;
};

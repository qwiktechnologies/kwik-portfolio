export const HERO_HEADLINE = "Your Digital Partner\nfor Business Growth";
export const HERO_SUBLINE = "Think. Design. Develop. Thrive";

export const WHO_WE_ARE = `At Qwiktechnologies, we are a team of passionate digital innovators dedicated to helping businesses thrive in the ever-evolving digital landscape. Our goal is to transform your vision into reality by providing a full suite of customized digital solutions that drive results and deliver lasting value.

Whether you need a stunning website, seamless user experiences, or strategies to grow your brand, we are here to guide you every step of the way.

Our team of seasoned designers and strategists bring a wealth of experience and a creative edge to every project.`;

const OLD_ABOUT = "Qwik Technologies sells website";

export function pageCopy(profile: {
  heroHeadline?: string | null;
  heroSubline?: string | null;
  aboutHeadline?: string | null;
  aboutBody?: string | null;
}) {
  const aboutBody = (profile.aboutBody || "").trim();
  return {
    heroHeadline: profile.heroHeadline?.trim() || HERO_HEADLINE,
    heroSubline: profile.heroSubline?.trim() || HERO_SUBLINE,
    aboutHeadline: profile.aboutHeadline?.trim() || "Who We Are",
    aboutBody: !aboutBody || aboutBody.startsWith(OLD_ABOUT) ? WHO_WE_ARE : aboutBody,
  };
}

export function paragraphs(text: string) {
  return text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean);
}

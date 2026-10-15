import { UserProfile, Gender } from '../types';

export interface GreetingInfo {
  timeGreeting: string; // "Selamat pagi" | "Selamat siang" | "Selamat sore" | "Selamat malam"
  timeIcon: string;
  salutation: string; // "Tuan [Nama]" | "Nona [Nama]" | "Sobat"
  fullGreetingLine: string; // "Selamat malam, Tuan Budi!"
  secondLine: string; // "Abah AI siap membantu 🤝"
  supportingText: string;
}

/**
 * Returns dynamic greeting based on user's current local time and saved profile
 * Time ranges according to specification:
 * - 04:00–10:59: "Selamat pagi"
 * - 11:00–14:59: "Selamat siang"
 * - 15:00–17:59: "Selamat sore"
 * - 18:00–03:59: "Selamat malam"
 */
export function getPersonalizedGreeting(profile: UserProfile | null, lang: 'id' | 'en' = 'id'): GreetingInfo {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  let timeGreeting = 'Selamat malam';
  let timeIcon = '🌙';

  // 04:00 (240 min) to 10:59 (659 min)
  if (timeInMinutes >= 240 && timeInMinutes <= 659) {
    timeGreeting = lang === 'en' ? 'Good morning' : 'Selamat pagi';
    timeIcon = '🌅';
  }
  // 11:00 (660 min) to 14:59 (899 min)
  else if (timeInMinutes >= 660 && timeInMinutes <= 899) {
    timeGreeting = lang === 'en' ? 'Good afternoon' : 'Selamat siang';
    timeIcon = '☀️';
  }
  // 15:00 (900 min) to 17:59 (1079 min)
  else if (timeInMinutes >= 900 && timeInMinutes <= 1079) {
    timeGreeting = lang === 'en' ? 'Good afternoon' : 'Selamat sore';
    timeIcon = '🌇';
  }
  // 18:00 to 03:59
  else {
    timeGreeting = lang === 'en' ? 'Good evening' : 'Selamat malam';
    timeIcon = '🌙';
  }

  const name = profile?.name?.trim();
  const gender: Gender = profile?.gender || 'male';

  let salutation = '';
  if (name) {
    if (lang === 'en') {
      salutation = gender === 'female' ? `Ms. ${name}` : `Mr. ${name}`;
    } else {
      salutation = gender === 'female' ? `Nona ${name}` : `Tuan ${name}`;
    }
  } else {
    salutation = lang === 'en' ? 'Friend' : 'Sobat Belajar';
  }

  const fullGreetingLine = `${timeGreeting}, ${salutation}!`;
  const secondLine =
    lang === 'en' ? 'Abah AI is ready to help 🤝' : 'Abah AI siap membantu 🤝';

  const supportingText =
    lang === 'en'
      ? 'What would you like to learn today? Ask anything from math, science, languages, to programming.'
      : 'Mau belajar apa hari ini? Tanyakan apa saja, dari matematika, sains, bahasa, hingga pemrograman.';

  return {
    timeGreeting,
    timeIcon,
    salutation,
    fullGreetingLine,
    secondLine,
    supportingText,
  };
}

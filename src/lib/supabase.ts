import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  title: string;
  description: string;
  details?: string;
  tech: string[];
  image_url?: string;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export async function submitContactMessage(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-contact-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(formData),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const emailResult = await response.json();

    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
          read: false
        }
      ])
      .select();

    if (error) throw error;

    return { email: emailResult, db: data };
  } catch (error) {
    console.error('Error submitting contact message:', error);
    throw error;
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

export async function markMessageAsRead(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
  order_index: number;
  created_at: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_url?: string;
  image_url?: string;
  order_index: number;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  description: string;
  content?: string;
  image_url?: string;
  published: boolean;
  published_date?: string;
  order_index: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achievement_date: string;
  image_url?: string;
  order_index: number;
  created_at: string;
}

export interface Resume {
  id: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export async function getSkills(): Promise<Skill[]> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
}

export async function addSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<Skill> {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data!;
  } catch (error) {
    console.error('Error adding skill:', error);
    throw error;
  }
}

export async function updateSkill(id: string, skill: Partial<Skill>): Promise<void> {
  try {
    const { error } = await supabase
      .from('skills')
      .update(skill)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating skill:', error);
    throw error;
  }
}

export async function deleteSkill(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting skill:', error);
    throw error;
  }
}

export async function getCertificates(): Promise<Certificate[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}

export async function addCertificate(cert: Omit<Certificate, 'id' | 'created_at'>): Promise<Certificate> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .insert([cert])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data!;
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
}

export async function updateCertificate(id: string, cert: Partial<Certificate>): Promise<void> {
  try {
    const { error } = await supabase
      .from('certificates')
      .update(cert)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating certificate:', error);
    throw error;
  }
}

export async function deleteCertificate(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('certificates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
}

export async function getBlogs(): Promise<Blog[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('published', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function addBlog(blog: Omit<Blog, 'id' | 'created_at'>): Promise<Blog> {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blog])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data!;
  } catch (error) {
    console.error('Error adding blog:', error);
    throw error;
  }
}

export async function updateBlog(id: string, blog: Partial<Blog>): Promise<void> {
  try {
    const { error } = await supabase
      .from('blogs')
      .update(blog)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
}

export async function deleteBlog(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw error;
  }
}

export async function getAchievements(): Promise<Achievement[]> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

export async function addAchievement(achievement: Omit<Achievement, 'id' | 'created_at'>): Promise<Achievement> {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .insert([achievement])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data!;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
}

export async function updateAchievement(id: string, achievement: Partial<Achievement>): Promise<void> {
  try {
    const { error } = await supabase
      .from('achievements')
      .update(achievement)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating achievement:', error);
    throw error;
  }
}

export async function deleteAchievement(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting achievement:', error);
    throw error;
  }
}

export async function getResume(): Promise<Resume | null> {
  try {
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching resume:', error);
    return null;
  }
}

export async function updateResume(resume: Omit<Resume, 'uploaded_at'>): Promise<Resume> {
  try {
    await deleteAllResumes();

    const { data, error } = await supabase
      .from('resume')
      .insert([{ ...resume }])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data!;
  } catch (error) {
    console.error('Error updating resume:', error);
    throw error;
  }
}

export async function deleteAllResumes(): Promise<void> {
  try {
    const { error } = await supabase
      .from('resume')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting resumes:', error);
  }
}

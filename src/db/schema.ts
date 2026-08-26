import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1. BOARD OF DIRECTORS
export const boardMembers = sqliteTable('board_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  role: text('role').notNull(),
  category: text('category', { enum: ['Core Leadership', 'Vice Leadership', 'Domain Heads'] }).notNull(),
  imageUrl: text('image_url').notNull(),
  bio: text('bio'),
  orderIndex: integer('order_index').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  tenureYear: text('tenure_year').default('2026'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updated_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// 2. EVENTS & TIMELINE
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type', { enum: ['CTF', 'Workshop', 'Seminar', 'Bootcamp'] }).notNull(),
  status: text('status', { enum: ['UPCOMING', 'ONGOING', 'PAST'] }).default('UPCOMING'),
  date: text('date').notNull(),
  time: text('time').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  imageUrl: text('image_url'),
  registrationUrl: text('registration_url'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// 3. GALLERY MEDIA
export const galleryItems = sqliteTable('gallery_items', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  quote: text('quote').default(''),
  date: text('date').default(''),
  year: text('year', { enum: ['2024', '2025', '2026'] }).default('2026'),
  category: text('category', { enum: ['CTFs', 'WORKSHOPS', 'HACKATHONS', 'BEHIND THE SCENES'] }).notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  imageUrl: text('image_url').notNull(),
  width: integer('width').default(600),
  height: integer('height').default(400),
  aspectClass: text('aspect_class').default('aspect-[3/2]'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// 4. PROJECTS & ARSENAL
export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  visibility: text('visibility', { enum: ['Public', 'Private'] }).default('Public'),
  status: text('status', { enum: ['ACTIVE_DEVELOPMENT', 'PRODUCTION_READY', 'BETA_TESTING', 'COMPLETED', 'MAINTAINED'] }).notNull(),
  description: text('description').notNull(),
  iconType: text('icon_type').default('terminal'),
  techStack: text('tech_stack', { mode: 'json' }).$type<string[]>().notNull(),
  contributors: integer('contributors').default(1),
  githubUrl: text('github_url').notNull(),
  liveDemoUrl: text('live_demo_url'),
  orderIndex: integer('order_index').default(0),
});

// 5. CONTACT INQUIRIES
export const contactMessages = sqliteTable('contact_messages', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  status: text('status', { enum: ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED'] }).default('UNREAD'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

// 6. CLUB MILESTONES & STATS
export const clubStats = sqliteTable('club_stats', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  label: text('label').notNull(),
  value: text('value').notNull(),
  orderIndex: integer('order_index').default(0),
});

// 7. ADMIN USERS
export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  salt: text('salt').notNull(),
  role: text('role', { enum: ['SUPER_ADMIN', 'EDITOR'] }).default('EDITOR'),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`),
});

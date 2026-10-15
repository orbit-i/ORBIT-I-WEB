import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import {
  getInquiries,
  getCertificates,
  getCareersJobs,
  getTeamMembers,
  getCmsPages,
  getBlogPosts,
  getChatbotConfig,
  getSiteNotice,
  getAdminUsers,
} from '@/server/utils/cmsStorage';
import { pool } from '@/server/config/db';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Safely collect stats from CMS storage (resilient with fallback)
    const [inquiries, certificates, jobs, team, pages, posts, admins] = await Promise.all([
      getInquiries().catch(() => []),
      getCertificates().catch(() => []),
      getCareersJobs().catch(() => []),
      getTeamMembers().catch(() => []),
      getCmsPages().catch(() => []),
      getBlogPosts().catch(() => []),
      getAdminUsers().catch(() => []),
    ]);

    // Try fetching client and project counts from DB if accessible
    let totalClients = 0;
    let pendingClients = 0;
    let totalProjects = 0;
    let activeProjects = 0;

    try {
      const [clientRows] = await pool.query(
        "SELECT COUNT(*) as total, SUM(CASE WHEN approved = 0 THEN 1 ELSE 0 END) as pending FROM client_information WHERE role = 'CLIENT'"
      );
      if (clientRows && clientRows.length > 0) {
        totalClients = Number(clientRows[0].total || 0);
        pendingClients = Number(clientRows[0].pending || 0);
      }
    } catch {
      totalClients = 0;
      pendingClients = 0;
    }

    try {
      const [projectRows] = await pool.query(
        "SELECT COUNT(*) as total, SUM(CASE WHEN status != 'COMPLETED' AND status != 'CANCELLED' THEN 1 ELSE 0 END) as active FROM project_details"
      );
      if (projectRows && projectRows.length > 0) {
        totalProjects = Number(projectRows[0].total || 0);
        activeProjects = Number(projectRows[0].active || 0);
      }
    } catch {
      totalProjects = 0;
      activeProjects = 0;
    }

    const newInquiries = (inquiries || []).filter((i) => i.status === 'NEW').length;
    const botConfig = getChatbotConfig();
    const notice = getSiteNotice();

    return NextResponse.json({
      success: true,
      metrics: {
        totalInquiries: (inquiries || []).length,
        newInquiries,
        totalCertificates: (certificates || []).length,
        totalClients,
        pendingClients,
        totalProjects,
        activeProjects,
        openJobs: (jobs || []).length,
        teamCount: (team || []).length,
        publishedPages: (pages || []).length,
        blogArticles: (posts || []).length,
        adminCount: (admins || []).length,
      },
      system: {
        chatbotEnabled: Boolean(botConfig?.enabled),
        siteNoticeEnabled: Boolean(notice?.enabled),
        nodeUptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      recentInquiries: (inquiries || []).slice(0, 5),
      recentCertificates: (certificates || []).slice(0, 5),
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    return NextResponse.json({
      success: true,
      metrics: {
        totalInquiries: 0,
        newInquiries: 0,
        totalCertificates: 0,
        totalClients: 0,
        pendingClients: 0,
        totalProjects: 0,
        activeProjects: 0,
        openJobs: 0,
        teamCount: 0,
        publishedPages: 0,
        blogArticles: 0,
        adminCount: 1,
      },
      system: {
        chatbotEnabled: true,
        siteNoticeEnabled: false,
        nodeUptime: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      recentInquiries: [],
      recentCertificates: [],
    });
  }
}

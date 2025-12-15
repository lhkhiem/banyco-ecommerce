"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedPostBySlug = exports.listPublishedPosts = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const domainUtils_1 = require("../../utils/domainUtils");
const DEFAULT_PAGE_SIZE = 10;
const listPublishedPosts = async (req, res) => {
    try {
        const { page = 1, pageSize = DEFAULT_PAGE_SIZE, q, topic, tag, featured_only } = req.query;
        const offset = ((Number(page) || 1) - 1) * (Number(pageSize) || DEFAULT_PAGE_SIZE);
        const limit = Number(pageSize) || DEFAULT_PAGE_SIZE;
        // Build WHERE clause
        const whereConditions = ["p.status = 'published'"];
        const replacements = { limit, offset };
        if (featured_only === 'true') {
            whereConditions.push('p.is_featured = TRUE');
        }
        if (q && typeof q === 'string' && q.trim().length > 0) {
            whereConditions.push(`(
        p.title ILIKE :search OR 
        p.excerpt ILIKE :search OR 
        p.content::text ILIKE :search
      )`);
            replacements.search = `%${q.trim()}%`;
        }
        if (topic && typeof topic === 'string') {
            const topicIds = topic.split(',').map(t => t.trim()).filter(Boolean);
            if (topicIds.length > 0) {
                whereConditions.push(`EXISTS (
          SELECT 1 FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id AND t.id = ANY(:topicIds::uuid[])
        )`);
                replacements.topicIds = `{${topicIds.join(',')}}`;
            }
        }
        if (tag && typeof tag === 'string') {
            const tagIds = tag.split(',').map(t => t.trim()).filter(Boolean);
            if (tagIds.length > 0) {
                whereConditions.push(`EXISTS (
          SELECT 1 FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id AND t.id = ANY(:tagIds::uuid[])
        )`);
                replacements.tagIds = `{${tagIds.join(',')}}`;
            }
        }
        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
        const listQuery = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.read_time,
        p.is_featured,
        p.published_at,
        p.created_at,
        a.id as cover_asset_id,
        a.url as cover_asset_url,
        a.cdn_url as cover_asset_cdn_url,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id
        ) AS topics_json,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ) AS tags_json
      FROM posts p
      LEFT JOIN assets a ON a.id = p.cover_asset_id
      ${whereClause}
      ORDER BY p.is_featured DESC, p.published_at DESC NULLS LAST, p.created_at DESC
      LIMIT :limit OFFSET :offset
    `;
        const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int AS total
      FROM posts p
      ${whereClause}
    `;
        const [items, countRows] = await Promise.all([
            database_1.default.query(listQuery, {
                replacements,
                type: sequelize_1.QueryTypes.SELECT,
            }),
            database_1.default.query(countQuery, {
                replacements: { ...replacements, limit: undefined, offset: undefined },
                type: sequelize_1.QueryTypes.SELECT,
            }),
        ]);
        const total = countRows?.[0]?.total ?? 0;
        const data = items.map((row) => {
            const topics = Array.isArray(row.topics_json) ? row.topics_json : [];
            const tags = Array.isArray(row.tags_json) ? row.tags_json : [];
            const coverImageUrl = (0, domainUtils_1.normalizeMediaUrl)(row.cover_asset_cdn_url) || (0, domainUtils_1.normalizeMediaUrl)(row.cover_asset_url);
            return {
                id: row.id,
                title: row.title,
                slug: row.slug,
                excerpt: row.excerpt,
                content: row.content,
                readTime: row.read_time,
                isFeatured: row.is_featured,
                publishedAt: row.published_at,
                createdAt: row.created_at,
                topics,
                tags,
                // Add imageUrl for frontend compatibility
                imageUrl: coverImageUrl,
                // Keep coverAsset for backward compatibility
                coverAsset: coverImageUrl ? {
                    id: row.cover_asset_id,
                    url: row.cover_asset_url,
                    cdnUrl: row.cover_asset_cdn_url,
                } : null,
                // Also add cover_asset (snake_case) for frontend that expects this format
                cover_asset: coverImageUrl ? {
                    id: row.cover_asset_id,
                    url: row.cover_asset_url,
                    cdn_url: row.cover_asset_cdn_url,
                } : null,
            };
        });
        res.json({
            success: true,
            data,
            total,
            page: Number(page) || 1,
            pageSize: limit,
        });
    }
    catch (error) {
        console.error('[public] listPublishedPosts error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch posts' });
    }
};
exports.listPublishedPosts = listPublishedPosts;
const getPublishedPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const query = `
      SELECT
        p.id,
        p.title,
        p.slug,
        p.excerpt,
        p.content,
        p.read_time,
        p.is_featured,
        p.published_at,
        p.created_at,
        p.seo,
        a.id as cover_asset_id,
        a.url as cover_asset_url,
        a.cdn_url as cover_asset_cdn_url,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_topics pt
          JOIN topics t ON t.id = pt.topic_id
          WHERE pt.post_id = p.id
        ) AS topics_json,
        (
          SELECT COALESCE(
            json_agg(
              jsonb_build_object('id', t.id, 'name', t.name)
            ) FILTER (WHERE t.id IS NOT NULL),
            '[]'::json
          )
          FROM post_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE pt.post_id = p.id
        ) AS tags_json
      FROM posts p
      LEFT JOIN assets a ON a.id = p.cover_asset_id
      WHERE p.status = 'published' AND p.slug = :slug
      LIMIT 1
    `;
        const result = await database_1.default.query(query, {
            replacements: { slug },
            type: sequelize_1.QueryTypes.SELECT,
        });
        if (!result || result.length === 0) {
            return res.status(404).json({ success: false, error: 'Post not found' });
        }
        const row = result[0];
        const topics = Array.isArray(row.topics_json) ? row.topics_json : [];
        const tags = Array.isArray(row.tags_json) ? row.tags_json : [];
        const coverImageUrl = (0, domainUtils_1.normalizeMediaUrl)(row.cover_asset_cdn_url) || (0, domainUtils_1.normalizeMediaUrl)(row.cover_asset_url);
        // Parse seo from JSONB if it's a string
        let parsedSeo = null;
        if (row.seo) {
            if (typeof row.seo === 'string') {
                try {
                    parsedSeo = JSON.parse(row.seo);
                }
                catch (error) {
                    parsedSeo = row.seo;
                }
            }
            else {
                parsedSeo = row.seo;
            }
        }
        const data = {
            id: row.id,
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt,
            content: row.content,
            readTime: row.read_time,
            isFeatured: row.is_featured,
            publishedAt: row.published_at,
            createdAt: row.created_at,
            seo: parsedSeo,
            topics,
            tags,
            // Add imageUrl for frontend compatibility
            imageUrl: coverImageUrl,
            // Keep coverAsset for backward compatibility
            coverAsset: coverImageUrl ? {
                id: row.cover_asset_id,
                url: row.cover_asset_url,
                cdnUrl: row.cover_asset_cdn_url,
            } : null,
            // Also add cover_asset (snake_case) for frontend that expects this format
            cover_asset: coverImageUrl ? {
                id: row.cover_asset_id,
                url: row.cover_asset_url,
                cdn_url: row.cover_asset_cdn_url,
            } : null,
        };
        res.json({ success: true, data });
    }
    catch (error) {
        console.error('[public] getPublishedPostBySlug error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch post' });
    }
};
exports.getPublishedPostBySlug = getPublishedPostBySlug;
//# sourceMappingURL=postController.js.map
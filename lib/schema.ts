export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Hillary's HR Blog",
    url: 'https://hillaryshr.blog',
    logo: 'https://hillaryshr.blog/favicon.svg',
    sameAs: ['https://linkedin.com/in/hillary-chukwu-'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'rahgmah@gmail.com',
      contactType: 'Customer Service',
    },
    description:
      'Daily Canadian employment law and HR updates curated from 6 sources, AI-summarized and annotated by Hillary Chukwu.',
  }
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateBlogPostingSchema(post: {
  title: string
  description: string
  datePublished: string
  slug: string
  topic?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    author: {
      '@type': 'Person',
      name: 'Hillary Chukwu',
      url: 'https://linkedin.com/in/hillary-chukwu-',
    },
    url: `https://hillaryshr.blog/take/${post.slug}`,
    keywords: post.topic || 'HR, employment law, compliance',
  }
}

export function generateToolSchema(tool: {
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    applicationCategory: 'BusinessApplication',
    url: tool.url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
    },
  }
}

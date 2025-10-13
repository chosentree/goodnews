'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import NotionPage from '@/components/NotionPage' // 核心内容组件导入

// 动态导入组件 (仅保留 LayoutSlug 依赖的)
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})

// 导入配置 (必须保留)
import CONFIG from './config'


// --- 【极简占位符布局 (保留结构完整性)】 ---

const LayoutBase = ({ children }) => <>{children}</>
const LayoutIndex = props => <LayoutPostList {...props} />
const LayoutPostList = () => <div>Post List Placeholder</div>
const LayoutSearch = () => <div>Search Placeholder</div>
const LayoutArchive = () => <div>Archive Placeholder</div>
const Layout404 = () => <div>404 Not Found</div>
const LayoutCategoryIndex = () => <div>Category Index Placeholder</div>
const LayoutTagIndex = () => <div>Tag Index Placeholder</div>


// --- 【核心修复组件：LayoutSlug】 ---

/**
 * 文章详情 (极简版，已修复编译错误)
 * 只显示：名称、播放量（阅读量）、正文
 * 隐藏：发布时间
 * @param {*} props 包含 post, lock, validPassword 等数据
 * @returns
 */
const LayoutSlug = props => {
  // 提取需要的属性：文章对象、锁定状态、密码
  const { post, lock, validPassword } = props
  const router = useRouter()
    
    // --- 【数据提取】 ---
    const viewCount = post?.viewCount || post?.views || 'N/A' 
    
  // --- 【原始 404 检查逻辑】 ---
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404 逻辑
    if (!post) {
      setTimeout(
        () => {
          if (isBrowser) {
            const article = document.querySelector('#article-wrapper #notion-article')
            if (!article) {
              router.push('/404').then(() => {
                console.warn('找不到页面', router.asPath)
              })
            }
          }
        },
        waiting404
      )
    }
  }, [post]) // <--- 关键点：useEffect 在此正确闭合
    
  return (
    <>
      {/* 1. 文章密码锁 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {/* 2. 核心内容：名称、播放量、正文 */}
      {!lock && post && (
        <div 
            id='article-content-only' 
            className='mx-auto px-4 w-full md:max-w-4xl lg:max-w-6xl bg-white dark:bg-gray-800 shadow-md py-10'>
            
            {/* 名称/标题 */}
            <h1 className='text-4xl font-extrabold mb-4 dark:text-white'>
                {post.title}
            </h1>
            
            {/* 播放量/阅读量 */}
            <div className='text-sm text-gray-500 mb-6 flex space-x-4'>
                <span>👁️‍🗨️ 阅读量: {view

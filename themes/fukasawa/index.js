'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global' // 保留，以防 siteConfig 内部依赖它
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// 【核心导入】
import NotionPage from '@/components/NotionPage'

// 【安全组件】
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})


/**
 * 文章详情 (极简版)
 * 显示：名称、播放量（阅读量）、正文
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
            
            {/* 元数据容器：只保留播放量 */}
            <div className

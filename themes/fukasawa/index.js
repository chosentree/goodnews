'use client'

import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

// 【新增导入】核心内容组件：NotionPage（正文）
import NotionPage from '@/components/NotionPage'

// 【保留导入】安全组件：文章密码锁
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})


/**
 * 文章详情 (极简版)
 * 只显示：名称、播放量（阅读量）、正文
 * 隐藏：发布时间及所有其他主题元素
 * @param {*} props 包含 post, lock, validPassword 等数据
 * @returns
 */
const LayoutSlug = props => {
  // 提取需要的属性：文章对象、锁定状态、密码
  const { post, lock, validPassword } = props
  const router = useRouter()
    
    // --- 【数据提取】 ---
    // 假设文章阅读量（播放量）存储在 post.viewCount 或 post.views 中
    const viewCount = post?.viewCount || post?.views || 'N/A' 
    
    // 发布时间的提取和格式化逻辑被保留在代码中（但未在 JSX 中渲染），
    // 以便在需要时快速取消注释。
    // let publishDate = '未知时间'
    // if (post?.date) {
    //     try {
    //         publishDate = new Date(post.date).toLocaleDateString('zh-CN', {
    //             year: 'numeric',
    //             month: '2-digit',
    //             day: '2-digit'
    //         })
    //     } catch (e) {
    //         console.error('日期格式化失败:', e)
    //     }
    // }


  // --- 【原始 404 检查逻辑保留】 ---
  const waiting404 = siteConfig('POST_WAITING_TIME_FOR_404') * 1000
  useEffect(() => {
    // 404
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
  }, [post])
    
  return (
    <>
      {/* 1. 文章密码锁（如果文章有密码保护） */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {/* 2. 核心内容：名称、播放量、正文 */}
      {!lock && post && (
        <div 
            id='article-content-only' 
            // 样式保持居中和背景色
            className='mx-auto px-4 w-full md:max-w-4xl lg:max-w-6xl bg-white dark:bg-gray-800 shadow-md py-10'>
            
            {/* 名称/标题 */}
            <h1 className='text-4xl font-extrabold mb-4 dark:text-white'>
                {post.title}
            </h1>
            
            {/* 元数据容器：只保留播放量 */}
            <div className='text-sm text-gray-500 mb-6 flex space-x-4'>
                {/*

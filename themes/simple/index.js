// 保留必要的导入
import NotionPage from '@/components/NotionPage'
import dynamic from 'next/dynamic'
// 导入 useGlobal 来获取全局状态，虽然在极简模式下可能用不上，
// 但为避免代码逻辑报错，可以保留，或者确保 post 对象能直接拿到所有数据。
// import { useGlobal } from '@/lib/global' // 暂时不需要

// 动态导入 ArticleLock (如果文章有密码保护，必须保留这个)
const ArticleLock = dynamic(() => import('./components/ArticleLock'), {
  ssr: false
})


/**
 * 极简 LayoutSlug：只保留文章名称、正文和播放量（阅读量）
 *  * @param {*} props 包含 post, lock, validPassword 等数据
 * @returns
 */
const LayoutSlug = props => {
  const { post, lock, validPassword } = props
    
    // 假设阅读量数据存储在 post.views 或 post.viewCount 属性中
    // 实际属性名取决于您的后端（NotionNext 或其他）配置
    const viewCount = post?.views || post?.viewCount || 'N/A' 
    // 或者直接使用 ArticleInfo 组件中包含的阅读量数据（如果您的 ArticleInfo 组件被精简到只显示名称和阅读量）

  return (
    <>
      {/* 1. 如果文章被锁定，保留密码输入组件 */}
      {lock && <ArticleLock validPassword={validPassword} />}

      {/* 2. 如果文章没有被锁定且数据存在，显示内容 */}
      {!lock && post && (
        <div id='article-content-only' className='w-full px-2'>
            
            {/* 保留名称/标题 */}
            <h1 className='text-3xl font-bold mb-2'>{post.title}</h1>
            
            {/* 保留播放量/阅读量 */}
            <div className='text-sm text-gray-500 mb-4'>
                <span>阅读量: {viewCount}</span>
            </div>
            
            <div id='article-wrapper'>
                {/* 核心正文：Notion文章主体 */}
                <NotionPage post={post} />
            </div>
        </div>
      )}
    </>
  )
}

// 最终导出时，只需要这个精简后的 LayoutSlug
export { LayoutSlug }

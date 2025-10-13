// ... (保留所有必要的导入和 404 检查逻辑) ...

/**
 * 文章详情 (极简版)
 * 显示：名称、播放量、正文
 * 隐藏：发布时间
 * @param {*} props 包含 post, lock, validPassword 等数据
 * @returns
 */
const LayoutSlug = props => {
    // 提取需要的属性：文章对象、锁定状态、密码
    const { post, lock, validPassword } = props
    
    // --- 【数据提取】 ---
    const viewCount = post?.viewCount || post?.views || 'N/A' 
    
    // 虽然我们不显示，但可以保留变量定义，以防后续需要
    let publishDate = '未知时间'
    if (post?.date) {
        try {
            publishDate = new Date(post.date).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            })
        } catch (e) {
            console.error('日期格式化失败:', e)
        }
    }

    // --- (省略 404 检查逻辑) ---

    return (
        <>
            {/* 1. 文章密码锁 */}
            {lock && <ArticleLock validPassword={validPassword} />}

            {/* 2. 核心内容容器 */}
            {!lock && post && (
                <div 
                    id='article-content-only' 
                    className='mx-auto px-4 w-full md:max-w-4xl lg:max-w-6xl bg-white dark:bg-gray-800 shadow-md py-10'>
                    
                    {/* 名称/标题：保留 */}
                    <h1 className='text-4xl font-extrabold mb-4 dark:text-white'>
                        {post.title}
                    </h1>
                    
                    {/* 元数据容器 */}
                    <div className='text-sm text-gray-500 mb-6 flex space-x-4'>
                        
                        {/* 隐藏 发布时间：将显示发布时间的 <span> 标签注释掉或删除 */}
                        {/* <span>📅 发布时间: {publishDate}</span> */}
                        
                        {/* 播放量/阅读量：保留 */}
                        <span>👁️‍🗨️ 阅读量: {viewCount}</span>
                        
                    </div>

                    {/* 正文：保留 */}
                    <div id='article-wrapper'>
                        <NotionPage post={post} />
                    </div>

                </div>
            )}
        </>
    )
}

// export { LayoutSlug }

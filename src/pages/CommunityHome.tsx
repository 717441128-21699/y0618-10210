import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Play, Heart, MessageCircle, MapPin, Hash } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';
import { TagChip } from '@/components/ui/TagChip';
import { Avatar } from '@/components/ui/Avatar';
import { useCommunityStore } from '@/stores/communityStore';
import { cn } from '@/lib/utils';

const channelTabs = [
  { value: 'recommend', label: '推荐' },
  { value: 'follow', label: '关注' },
  { value: 'nearby', label: '附近' },
  { value: 'topic', label: '话题' },
];

const topicTags = [
  { id: 't1', name: '我的手语日常', count: 2341 },
  { id: 't2', name: '求助翻译', count: 856 },
  { id: 't3', name: '学习心得', count: 1523 },
  { id: 't4', name: '今日打卡', count: 3421 },
  { id: 't5', name: '手语教学', count: 987 },
  { id: 't6', name: '职场经验', count: 432 },
  { id: 't7', name: '生活分享', count: 1876 },
];

const videoThumbnails = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
];

const sampleCaptions = [
  ['大家好，今天教大家一个', '超实用的日常手语！'],
  ['跟我一起做，这个手势', '表示「谢谢你」'],
  ['去医院看病时，这个', '手语一定要学会'],
  ['职场新人必看，面试时', '的自我介绍手语'],
  ['买东西砍价必备，这个', '手势太实用了'],
  ['学会这5个手语，餐厅', '点餐无障碍'],
  ['新手入门，数字1到10', '标准动作教学'],
  ['家庭沟通必备，怎么用', '手语说「我爱你」'],
  ['旅行手语系列，问路', '再也不怕迷路了'],
  ['情感表达，如何用手语', '说「我错了对不起」'],
];

export default function CommunityHome() {
  const navigate = useNavigate();
  const { posts, loading, fetchPosts, likedPostIds, toggleLike } = useCommunityStore();
  const [activeChannel, setActiveChannel] = useState('recommend');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleLike = async (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    await toggleLike(postId);
  };

  const displayPosts = posts.length > 0 ? posts : Array.from({ length: 10 }, (_, i) => ({
    id: `mock_${i}`,
    authorId: `a${i}`,
    authorName: ['手语小美', '阿飞的日常', '翻译志愿者小周', '听障女孩阿青', '手语老师老王', '阳光少年小杰', '爱画画的小丽', '旅行达人阿坤', '职场小能手', '手语学习者'][i],
    authorAvatar: `https://images.unsplash.com/photo-${['1438761681033-6461ffad8d80', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e', '1544005313-94ddf0286df2', '1472099645785-5658abf4ff4e', '1506794778202-cad84cf45f1d', '1534528741775-53994a69daeb', '1519085360753-af0119f7cbe7', '1535713875002-d1d0cf377fde', '1539571696357-5a69c17a67c6'][i]}?w=100&h=100&fit=crop&crop=face`,
    channel: 'share' as const,
    title: sampleCaptions[i][0] + sampleCaptions[i][1],
    content: '',
    likes: [1256, 234, 3580, 892, 567, 2890, 1520, 2130, 1780, 4250][i],
    comments: [42, 56, 128, 35, 89, 156, 67, 78, 92, 145][i],
    views: 0,
    isLiked: i % 4 === 1,
    createdAt: new Date().toISOString(),
  }));

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-2xl font-bold text-text-primary">社区广场</h1>
          <div className="hidden sm:block">
            <Tabs
              items={channelTabs}
              value={activeChannel}
              onChange={setActiveChannel}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-muted" />
            <input
              type="text"
              placeholder="搜索帖子、话题、用户..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="sm:hidden mb-6">
        <Tabs
          items={channelTabs}
          value={activeChannel}
          onChange={setActiveChannel}
          className="w-full overflow-x-auto"
        />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <MapPin className="w-4 h-4 text-accent-orange-500 shrink-0" />
          {topicTags.map((tag) => (
            <TagChip
              key={tag.id}
              variant={selectedTopic === tag.id ? 'primary' : 'default'}
              selected={selectedTopic === tag.id}
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedTopic(selectedTopic === tag.id ? null : tag.id)}
            >
              <Hash className="w-3 h-3" />
              {tag.name}
              <span className="text-xs opacity-70 ml-1">({tag.count.toLocaleString()})</span>
            </TagChip>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative rounded-2xl overflow-hidden animate-pulse"
              style={{ height: i % 2 === 0 ? '340px' : '400px' }}
            >
              <div className="absolute inset-0 bg-surface-border/50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayPosts.map((post, idx) => {
            const isLiked = post.id.startsWith('mock_') ? post.isLiked : likedPostIds.has(post.id);
            const likes = post.id.startsWith('mock_') ? post.likes : (post.likes + (likedPostIds.has(post.id) ? 0 : 0));
            return (
              <div
                key={post.id}
                className={cn(
                  'relative rounded-2xl overflow-hidden group cursor-pointer',
                  'transition-all duration-300 ease-out hover:shadow-elevation hover:-translate-y-1',
                  'animate-fade-in-up'
                )}
                style={{
                  height: idx % 3 === 0 ? '340px' : idx % 3 === 1 ? '400px' : '360px',
                  animationDelay: `${idx * 60}ms`,
                }}
                onMouseEnter={() => setHoveredCard(post.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/community/post/${post.id}`)}
              >
                <div
                  className="absolute inset-0"
                  style={{ background: videoThumbnails[idx % videoThumbnails.length] }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    'transition-opacity duration-300',
                    hoveredCard === post.id ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <div className="w-16 h-16 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>

                <div className="absolute bottom-20 left-4 right-4">
                  <div className="space-y-1">
                    {sampleCaptions[idx % sampleCaptions.length].map((line, lineIdx) => (
                      <p
                        key={lineIdx}
                        className="text-white text-sm font-medium drop-shadow-lg animate-fade-in"
                        style={{ animationDelay: `${lineIdx * 150}ms` }}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={post.authorAvatar}
                      alt={post.authorName}
                      fallback={post.authorName}
                      size="sm"
                      className="ring-2 ring-white/80"
                    />
                    <span className="text-white text-xs font-medium drop-shadow-lg">
                      {post.authorName}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className={cn(
                        'flex items-center gap-1 text-white drop-shadow-lg transition-all duration-200 hover:scale-110',
                        isLiked && 'text-accent-orange-400'
                      )}
                      onClick={(e) => handleLike(e, post.id)}
                    >
                      <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                      <span className="text-xs font-medium">{(likes).toLocaleString()}</span>
                    </button>
                    <div className="flex items-center gap-1 text-white drop-shadow-lg">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">{post.comments.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/community/create')}
        className={cn(
          'fixed right-6 bottom-24 lg:bottom-8 z-40',
          'w-14 h-14 rounded-full bg-gradient-accent shadow-button-hover',
          'flex items-center justify-center text-white',
          'transition-all duration-300 hover:scale-110 hover:shadow-elevation',
          'active:scale-95 animate-float'
        )}
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

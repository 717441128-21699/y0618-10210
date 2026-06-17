import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Send,
  Smile,
  UserPlus,
  Check,
  Type,
  AlertCircle,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { TagChip } from '@/components/ui/TagChip';
import { useCommunityStore } from '@/stores/communityStore';
import { useUserStore } from '@/stores/userStore';
import { cn } from '@/lib/utils';

interface SubtitleLine {
  start: number;
  end: number;
  text: string;
}

const mockSubtitles: SubtitleLine[] = [
  { start: 0, end: 2, text: '大家好' },
  { start: 2, end: 4, text: '欢迎来到' },
  { start: 4, end: 6, text: '今天的手语教学' },
  { start: 6, end: 8, text: '今天我们学习' },
  { start: 8, end: 10, text: '非常实用的' },
  { start: 10, end: 12, text: '就医常用手语' },
  { start: 12, end: 15, text: '请大家跟我一起做' },
];

const mockTopics = ['手语教学', '就医指南', '实用手语', '新手必看'];

interface MockComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
}

const mockComments: MockComment[] = [
  {
    id: 'c1',
    authorName: '手语初学者小李',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    content: '太棒了！这个去医院真的很实用，收藏起来慢慢学！',
    likes: 32,
    createdAt: '2小时前',
  },
  {
    id: 'c2',
    authorName: '听障女孩阿青',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    content: '老师讲得好清楚，每个动作都看明白了！下次去医院试试~',
    likes: 28,
    createdAt: '3小时前',
  },
  {
    id: 'c3',
    authorName: '志愿者小王',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    content: '请问有没有更完整的医疗手语系列？想系统学习一下。',
    likes: 15,
    createdAt: '5小时前',
  },
  {
    id: 'c4',
    authorName: '默默学习的人',
    authorAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
    content: '跟着练了三遍，终于记住了「挂号」和「取药」的手势！',
    likes: 19,
    createdAt: '昨天',
  },
];

export default function CommunityPost() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { currentPost, comments, loading, fetchPost, toggleLike, addComment, likedPostIds } =
    useCommunityStore();
  const { user, fetchUser } = useUserStore();

  const [isFollowing, setIsFollowing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [commentText, setCommentText] = useState('');

  const postData = useMemo(() => {
    if (currentPost) return currentPost;
    return {
      id: postId || 'p001',
      authorId: 'a001',
      authorName: '手语老师老王',
      authorAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
      channel: 'share' as const,
      title: '医院就医手语实战教学',
      content:
        '这期视频给大家整理了去医院最常用的手语表达，从挂号、问诊到取药全程覆盖。建议大家收藏起来，去医院前看一看，也可以分享给有需要的朋友。手语学习贵在坚持，我们一起加油！',
      images: undefined,
      likes: 2890,
      comments: 156,
      views: 38900,
      isLiked: false,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };
  }, [currentPost, postId]);

  const displayComments = useMemo(() => {
    if (comments.length > 0) return comments;
    return mockComments;
  }, [comments]);

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
    }
    fetchUser();
  }, [fetchPost, postId, fetchUser]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentTime((t) => (t >= 15 ? 0 : t + 0.5));
    }, 500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const currentSubtitle = useMemo(() => {
    return mockSubtitles.find((s) => currentTime >= s.start && currentTime < s.end);
  }, [currentTime]);

  const handleLike = async () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    if (postId) await toggleLike(postId);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    if (postId) {
      await addComment({ postId, content: commentText });
    }
    setCommentText('');
  };

  const fontSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  const isPostLiked = likedPostIds.has(postData.id) || isLiked;
  const displayLikes = postData.likes + (isPostLiked && !postData.isLiked ? 1 : 0);

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card border border-surface-border/60 flex items-center justify-center text-text-secondary hover:text-primary-600 hover:shadow-card-hover transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary truncate flex-1">
          {loading ? '加载中...' : postData.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-3xl overflow-hidden shadow-card bg-black animate-fade-in-up">
            <div
              className="relative w-full flex items-center justify-center"
              style={{ aspectRatio: '9 / 16', maxHeight: '75vh' }}
            >
              <div className="absolute inset-0 bg-gradient-hero" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-400/20 via-transparent to-black/40" />

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 w-24 h-24 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border-2 border-white/40 transition-all duration-300 hover:scale-110 hover:bg-white/30 group"
              >
                <Play
                  className={cn('w-12 h-12 text-white transition-all duration-300', !isPlaying && 'ml-2')}
                  fill="white"
                  style={{ display: isPlaying ? 'none' : 'block' }}
                />
                {isPlaying && (
                  <div className="flex gap-1.5">
                    <div className="w-2 h-10 bg-white rounded-full animate-breathe" />
                    <div className="w-2 h-8 bg-white rounded-full animate-breathe" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-12 bg-white rounded-full animate-breathe" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </button>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8 pt-20">
                <div className="text-center mb-4">
                  <p
                    className={cn(
                      'font-bold text-white drop-shadow-2xl transition-all duration-500',
                      fontSizeClasses[fontSize]
                    )}
                    style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
                  >
                    {currentSubtitle ? (
                      <span className="inline-block animate-scale-in">
                        {currentSubtitle.text.split('').map((char, i) => (
                          <span
                            key={i}
                            className={cn(
                              'inline-block transition-all duration-300',
                              'hover:text-accent-yellow-400'
                            )}
                            style={{
                              animation: 'fadeInUp 0.3s ease-out both',
                              animationDelay: `${i * 50}ms`,
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="opacity-60">点击播放按钮开始观看</span>
                    )}
                  </p>
                </div>

                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-accent rounded-full transition-all duration-500"
                    style={{ width: `${(currentTime / 15) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 text-white/70 text-xs">
                  <span>{Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
                      <Type className="w-3.5 h-3.5" />
                      {(['sm', 'md', 'lg'] as const).map((size) => (
                        <button
                          key={size}
                          onClick={() => setFontSize(size)}
                          className={cn(
                            'px-1.5 py-0.5 rounded text-[10px] font-medium transition-all',
                            fontSize === size ? 'bg-accent-orange-500 text-white' : 'hover:bg-white/10'
                          )}
                        >
                          {size === 'sm' ? '小' : size === 'md' ? '中' : '大'}
                        </button>
                      ))}
                    </div>
                    <span>0:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-text-tertiary text-sm bg-primary-50 border border-primary-100 rounded-xl py-3 px-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <AlertCircle className="w-4 h-4 text-primary-500" />
            <span>字幕由系统自动生成，如有错误欢迎反馈</span>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-start gap-3">
              <Avatar
                src={postData.authorAvatar}
                alt={postData.authorName}
                fallback={postData.authorName}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-text-primary">{postData.authorName}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">手语教学达人 · 高级翻译资质</p>
                <div className="flex gap-2 mt-2">
                  <div className="flex gap-1 text-xs text-accent-orange-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3" fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-xs text-text-tertiary">4.9 · 12.5万粉丝</span>
                </div>
              </div>
              <Button
                variant={isFollowing ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn('shrink-0 transition-all duration-300')}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-4 h-4" />
                    已关注
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    关注
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <p className="text-sm text-text-secondary leading-relaxed">
              {postData.content}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {mockTopics.map((topic) => (
                <TagChip
                  key={topic}
                  variant="primary"
                  size="sm"
                  className="cursor-pointer hover:scale-105 transition-transform"
                >
                  #{topic}
                </TagChip>
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-4 flex items-center gap-2">
              <span>👁️ {(postData.views || 38900).toLocaleString()} 次观看</span>
              <span>·</span>
              <span>📅 3天前发布</span>
            </p>
          </div>

          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-5 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <div className="grid grid-cols-4 gap-2">
              {[
                {
                  icon: Heart,
                  label: '点赞',
                  count: displayLikes,
                  active: isPostLiked,
                  activeColor: 'text-red-500',
                  onClick: handleLike,
                },
                {
                  icon: MessageCircle,
                  label: '评论',
                  count: postData.comments,
                  active: false,
                  activeColor: 'text-primary-600',
                  onClick: () => {},
                },
                {
                  icon: Share2,
                  label: '转发',
                  count: 326,
                  active: false,
                  activeColor: 'text-accent-mint-500',
                  onClick: () => {},
                },
                {
                  icon: Star,
                  label: '收藏',
                  count: 892,
                  active: isStarred,
                  activeColor: 'text-accent-yellow-500',
                  onClick: () => setIsStarred(!isStarred),
                },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className={cn(
                    'flex flex-col items-center gap-2 py-3 rounded-xl transition-all duration-200',
                    'hover:bg-surface-bg active:scale-95',
                    item.active ? item.activeColor : 'text-text-tertiary hover:text-text-secondary'
                  )}
                >
                  <div className="relative">
                    <item.icon
                      className={cn(
                        'w-6 h-6 transition-all duration-300',
                        item.active && 'animate-bounce-subtle'
                      )}
                      fill={item.active ? 'currentColor' : 'none'}
                    />
                    {item.active && (
                      <div className="absolute -inset-2 rounded-full bg-current opacity-10 animate-ping" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.count.toLocaleString()}</span>
                  <span className="text-[10px] opacity-70">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 overflow-hidden animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <div className="p-4 border-b border-surface-border/60 flex items-center justify-between">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary-600" />
                评论 <span className="text-text-tertiary text-sm">({displayComments.length})</span>
              </h3>
              <button className="text-xs text-primary-600 font-medium hover:text-primary-700">查看全部</button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-1 p-4">
              {displayComments.map((comment, idx) => (
                <div
                  key={comment.id}
                  className="flex gap-3 p-3 rounded-xl hover:bg-surface-bg/70 transition-colors animate-fade-in-up"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <Avatar
                    src={(comment as any).authorAvatar}
                    alt={(comment as any).authorName}
                    fallback={(comment as any).authorName}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-text-primary truncate">
                        {(comment as any).authorName}
                      </h4>
                      <span className="text-xs text-text-tertiary shrink-0">
                        {(comment as any).createdAt}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <button className="flex items-center gap-1 text-xs text-text-tertiary hover:text-red-500 transition-colors">
                        <Heart className="w-3.5 h-3.5" />
                        {(comment as any).likes}
                      </button>
                      <button className="text-xs text-text-tertiary hover:text-primary-600 transition-colors">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-surface-border/60 bg-surface-bg/30">
              <div className="flex items-center gap-3">
                <Avatar
                  src={user?.avatar}
                  alt={user?.name || '我'}
                  fallback={user?.name || '我'}
                  size="sm"
                />
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    placeholder="说点什么友善的话吧..."
                    className="w-full pl-4 pr-24 py-2.5 rounded-full border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button className="w-8 h-8 rounded-full flex items-center justify-center text-surface-muted hover:text-accent-yellow-500 hover:bg-accent-yellow-50 transition-all">
                      <Smile className="w-4 h-4" />
                    </button>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim()}
                      className="px-3 py-1.5 text-xs rounded-full"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      发送
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

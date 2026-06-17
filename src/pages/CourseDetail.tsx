import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  BookOpen,
  Play,
  CheckCircle2,
  Circle,
  ChevronRight,
  Award,
  Target,
  UserCheck,
  TrendingUp,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Sparkles,
  Shield,
  Video,
  FileText,
  HeartHandshake,
} from 'lucide-react';
import { useCourseStore } from '@/stores/courseStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TagChip } from '@/components/ui/TagChip';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent } from '@/components/ui/Tabs';
import type { Lesson } from '@/types';
import { mockLessons } from '@/mock/data';
import { cn } from '@/lib/utils';

const levelTextMap: Record<string, string> = {
  beginner: '入门',
  intermediate: '初级',
  advanced: '中级',
};

const levelVariantMap: Record<string, 'success' | 'warning' | 'danger'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'danger',
};

const mockTeachers: Record<string, { name: string; avatar: string; title: string; bio: string }> = {
  c001: {
    name: '王静怡',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
    title: '国家一级手语翻译 / 10年教学经验',
    bio: '中国聋人协会手语委员会委员，曾任北京残奥会手语翻译，专注手语基础教育，擅长零基础教学。',
  },
  c002: {
    name: '张伟',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    title: '高级手语教师 / 听障人士',
    bio: '先天性听障，手语母语者，从事手语教学8年，擅长将生活场景融入教学，深受学员喜爱。',
  },
  c003: {
    name: '李晓红',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    title: '医疗手语专家 / 三甲医院顾问',
    bio: '北京协和医院手语顾问，熟悉医疗流程和专业术语，帮助过300+听障患者顺利就医。',
  },
  c004: {
    name: '陈建国',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    title: '职场手语培训师 / 前HR总监',
    bio: '曾任世界500强企业HR总监，后转型手语培训，帮助200+听障人士成功入职名企。',
  },
  c005: {
    name: '刘美玲',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    title: '特殊教育硕士 / 手语教研员',
    bio: '北京师范大学特殊教育硕士，专注聋人教育研究12年，出版多部手语教育专著。',
  },
  c006: {
    name: '赵志强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    title: '执业律师 / 法律手语翻译',
    bio: '执业律师+国家级手语翻译双重资质，处理过50+聋人法律援助案件，维护听障人士合法权益。',
  },
  c007: {
    name: '周慧敏',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    title: '心理咨询师 / 家庭沟通专家',
    bio: '国家二级心理咨询师，专注听障家庭关系辅导，帮助过上千个家庭建立有效沟通。',
  },
  c008: {
    name: '孙鹏飞',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    title: '资深驴友 / 旅行手语达人',
    bio: '听障旅行博主，独自走遍全国30+省份，总结出一套旅行实用手语，让听障人士也能畅游世界。',
  },
};

const mockPrices: Record<string, { price: string; original: string; isFree: boolean }> = {
  c001: { price: '免费', original: '', isFree: true },
  c002: { price: '¥99', original: '¥199', isFree: false },
  c003: { price: '¥199', original: '¥399', isFree: false },
  c004: { price: '¥299', original: '¥599', isFree: false },
  c005: { price: '¥149', original: '¥299', isFree: false },
  c006: { price: '¥399', original: '¥799', isFree: false },
  c007: { price: '免费', original: '', isFree: true },
  c008: { price: '¥179', original: '¥359', isFree: false },
};

const mockReviews: Array<{
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  createdAt: string;
  likes: number;
}> = [
  {
    id: 'r001',
    userName: '听障女孩小花',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: '老师讲得非常详细，每个手势都有慢动作分解，零基础也能学会！以前去医院总是很紧张，现在学会这些手语终于可以自己和医生沟通了，强烈推荐！',
    createdAt: '2026-03-15',
    likes: 128,
  },
  {
    id: 'r002',
    userName: '健听人小王',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    content: '我是健听人，因为工作需要学习手语。这门课的内容非常专业，老师的手语动作也很标准。配套的练习题设计得很好，能帮助巩固记忆。',
    createdAt: '2026-03-10',
    likes: 96,
  },
  {
    id: 'r003',
    userName: '手语爱好者阿明',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    content: '整体课程质量很高，唯一不足的是有些课时内容可以再丰富一些。不过以这个价格来说已经非常划算了，期待老师出更多进阶课程！',
    createdAt: '2026-03-05',
    likes: 64,
  },
];

const targetAudiences = [
  { icon: UserCheck, text: '零基础手语学习者' },
  { icon: Target, text: '有一定基础想系统提升者' },
  { icon: HeartHandshake, text: '听障人士家属及朋友' },
  { icon: Award, text: '从事相关服务的工作人员' },
];

const courseHighlights = [
  { icon: Video, text: '高清视频教学，慢动作演示' },
  { icon: FileText, text: '配套图文讲义，方便复习' },
  { icon: Sparkles, text: '手势AI识别练习，即时反馈' },
  { icon: Shield, text: '永久有效，随时回看复习' },
];

export default function CourseDetail() {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse, loading, fetchCourse } = useCourseStore();
  const [activeTab, setActiveTab] = useState('outline');

  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  }, [courseId, fetchCourse]);

  const lessons: Lesson[] = useMemo(() => {
    if (!courseId) return [];
    return mockLessons[courseId] || [];
  }, [courseId]);

  const teacher = courseId
    ? mockTeachers[courseId] || { name: '专业教师', avatar: '', title: '', bio: '' }
    : { name: '专业教师', avatar: '', title: '', bio: '' };

  const pricing = courseId
    ? mockPrices[courseId] || { price: '免费', original: '', isFree: true }
    : { price: '免费', original: '', isFree: true };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatCourseDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}小时${m > 0 ? `${m}分` : ''}` : `${m}分钟`;
  };

  const formatCount = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
    return String(n);
  };

  const completedLessons = lessons.filter((l) => l.completed).length;
  const progress = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  const handleStartLesson = (lessonId: string) => {
    navigate(`/course/${courseId}/lesson/${lessonId}`);
  };

  if (loading && !currentCourse) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-text-tertiary">加载中...</div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">课程不存在</h3>
          <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg pb-12">
      <div className="relative h-72 md:h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentCourse.cover})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-surface-bg" />
        <div className="absolute top-6 left-4 md:left-8 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="!text-white hover:!bg-white/20"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/courses')}
          >
            返回列表
          </Button>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 -mt-32 relative z-10">
        <div className="mb-6 animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <TagChip
              variant={levelVariantMap[currentCourse.level]}
              selected
            >
              {levelTextMap[currentCourse.level]}
            </TagChip>
            <TagChip variant="primary" size="sm">
              {currentCourse.category}
            </TagChip>
            {currentCourse.tags.slice(0, 3).map((tag) => (
              <TagChip key={tag} size="sm" variant="default">
                {tag}
              </TagChip>
            ))}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 drop-shadow-lg">
            {currentCourse.title}
          </h1>
          <p className="text-white/90 text-base md:text-lg max-w-3xl line-clamp-2 mb-4">
            {currentCourse.description}
          </p>
          <div className="flex flex-wrap items-center gap-5 text-white/90">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 text-accent-yellow-400 fill-accent-yellow-400" />
              <span className="font-bold text-lg">{currentCourse.rating}</span>
              <span className="text-white/70 text-sm">（超棒）</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-5 h-5" />
              <span>{formatCount(currentCourse.students)}人学习</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-5 h-5" />
              <span>{currentCourse.totalLessons}课时</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-5 h-5" />
              <span>共{formatCourseDuration(currentCourse.duration)}</span>
            </div>
          </div>
        </div>

        <Card className="mb-6 p-5 animate-fade-in-up stagger-1">
          <div className="flex flex-col md:flex-row items-center gap-5">
            <Avatar src={teacher.avatar} alt={teacher.name} size="xl" />
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-text-primary mb-1">
                {teacher.name}
              </h3>
              <p className="text-accent-orange-500 font-medium mb-2">
                {teacher.title}
              </p>
              <p className="text-text-secondary text-sm line-clamp-2">
                {teacher.bio}
              </p>
            </div>
            <Button variant="secondary" size="md">
              关注教师
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="animate-fade-in-up stagger-2">
              <div className="p-5 border-b border-surface-border/60 overflow-x-auto">
                <Tabs
                  items={[
                    {
                      value: 'outline',
                      label: '课程目录',
                      icon: <BookOpen className="w-4 h-4" />,
                    },
                    {
                      value: 'intro',
                      label: '课程介绍',
                      icon: <FileText className="w-4 h-4" />,
                    },
                    {
                      value: 'reviews',
                      label: '学员评价',
                      icon: <MessageCircle className="w-4 h-4" />,
                    },
                  ]}
                  value={activeTab}
                  onChange={setActiveTab}
                />
              </div>

              <TabsContent value="outline" currentValue={activeTab}>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-5 p-4 bg-surface-bg rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-text-primary">学习进度</p>
                        <p className="text-sm text-text-tertiary">
                          已完成 {completedLessons} / {lessons.length} 课时
                        </p>
                      </div>
                    </div>
                    <div className="w-40">
                      <ProgressBar
                        value={completedLessons}
                        max={lessons.length}
                        color="orange"
                        showPercentage
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 cursor-pointer group',
                          lesson.completed
                            ? 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
                            : idx === completedLessons
                            ? 'bg-accent-orange-50 border-accent-orange-300 hover:bg-accent-orange-50/70 shadow-sm'
                            : 'bg-surface-card border-surface-border hover:border-primary-200 hover:bg-surface-bg'
                        )}
                        onClick={() => handleStartLesson(lesson.id)}
                      >
                        <div className="shrink-0">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                          ) : idx === completedLessons ? (
                            <div className="w-7 h-7 rounded-full bg-accent-orange-500 flex items-center justify-center animate-breathe">
                              <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" />
                            </div>
                          ) : (
                            <Circle className="w-7 h-7 text-surface-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-text-tertiary">
                              第{idx + 1}课
                            </span>
                            {idx === completedLessons && !lesson.completed && (
                              <Badge variant="warning" className="bg-accent-orange-100 text-accent-orange-600 border-accent-orange-200">
                                进行中
                              </Badge>
                            )}
                            {lesson.completed && (
                              <Badge variant="success">已完成</Badge>
                            )}
                          </div>
                          <h4 className={cn(
                            'font-semibold truncate',
                            idx === completedLessons ? 'text-accent-orange-600' : 'text-text-primary'
                          )}>
                            {lesson.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-sm text-text-tertiary flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDuration(lesson.duration)}
                          </span>
                          <ChevronRight className={cn(
                            'w-5 h-5 transition-all duration-300 group-hover:translate-x-0.5',
                            idx === completedLessons ? 'text-accent-orange-500' : 'text-text-tertiary'
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="intro" currentValue={activeTab}>
                <div className="p-5 space-y-6">
                  <section>
                    <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-accent-orange-500" />
                      课程简介
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {currentCourse.description}
                    </p>
                  </section>
                  <section>
                    <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent-orange-500" />
                      你将学到什么
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        `掌握${currentCourse.category}场景的核心手语表达`,
                        '理解标准手语的手型、位置、运动轨迹',
                        '能够独立完成该场景下的手语沟通',
                        '了解手语文化和沟通注意事项',
                        '获得配套学习资料和练习素材',
                        '通过结业测试获得学习证书',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-surface-bg rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="text-text-secondary text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </TabsContent>

              <TabsContent value="reviews" currentValue={activeTab}>
                <div className="p-5 space-y-5">
                  <div className="flex items-center justify-between p-5 bg-gradient-hero rounded-xl text-white">
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold">{currentCourse.rating}</span>
                        <span className="text-white/70">/ 5.0</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className="w-5 h-5 text-accent-yellow-300 fill-accent-yellow-300"
                          />
                        ))}
                      </div>
                      <p className="text-sm text-white/70">
                        基于 {formatCount(currentCourse.students)} 位学员的评价
                      </p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <div className="text-6xl font-bold opacity-10">A+</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {mockReviews.map((review, idx) => (
                      <CardBody key={review.id} className="!p-5 border border-surface-border/60 rounded-xl animate-fade-in-up" style={{ animationDelay: `${idx * 80}ms` }}>
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar src={review.userAvatar} alt={review.userName} size="md" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-text-primary truncate">
                                {review.userName}
                              </h4>
                              <span className="text-xs text-text-tertiary flex items-center gap-1 shrink-0">
                                <Calendar className="w-3 h-3" />
                                {review.createdAt}
                              </span>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((n) => (
                                <Star
                                  key={n}
                                  className={cn(
                                    'w-4 h-4',
                                    n <= review.rating
                                      ? 'text-accent-yellow-500 fill-accent-yellow-500'
                                      : 'text-surface-border'
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-3">
                          {review.content}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <button className="flex items-center gap-1 text-text-tertiary hover:text-accent-orange-500 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            有用 ({review.likes})
                          </button>
                          <button className="flex items-center gap-1 text-text-tertiary hover:text-primary-600 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            回复
                          </button>
                        </div>
                      </CardBody>
                    ))}
                  </div>

                  <div className="text-center pt-2">
                    <Button variant="secondary">查看更多评价</Button>
                  </div>
                </div>
              </TabsContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-in-up stagger-3 sticky top-6">
              <div className="p-6">
                {pricing.isFree ? (
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-emerald-500">免费</span>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-bold text-accent-orange-500">
                        {pricing.price}
                      </span>
                      <span className="text-lg text-text-tertiary line-through">
                        {pricing.original}
                      </span>
                    </div>
                    <Badge variant="warning">限时优惠 · 省{parseInt(pricing.original.replace('¥', '')) - parseInt(pricing.price.replace('¥', ''))}元</Badge>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <Button
                    size="lg"
                    className="w-full text-base py-4"
                    rightIcon={<Play className="w-5 h-5" />}
                    onClick={() => {
                      const nextLesson = lessons.find((l) => !l.completed) || lessons[0];
                      if (nextLesson) handleStartLesson(nextLesson.id);
                    }}
                  >
                    {completedLessons > 0 ? '继续学习' : pricing.isFree ? '立即开始学习' : '立即报名'}
                  </Button>
                  {!pricing.isFree && (
                    <Button variant="secondary" size="lg" className="w-full">
                      加入购物车
                    </Button>
                  )}
                </div>

                <div className="space-y-4 pt-5 border-t border-surface-border/60">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      学习人数
                    </span>
                    <span className="font-bold text-text-primary">{formatCount(currentCourse.students)}人</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      完课率
                    </span>
                    <span className="font-bold text-emerald-600">92.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      好评率
                    </span>
                    <span className="font-bold text-accent-orange-500">98.8%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="animate-fade-in-up stagger-4">
              <div className="p-5 border-b border-surface-border/60">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-primary-600" />
                  适合人群
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {targetAudiences.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="text-text-secondary text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="animate-fade-in-up stagger-5">
              <div className="p-5 border-b border-surface-border/60">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-orange-500" />
                  课程亮点
                </h3>
              </div>
              <div className="p-5 space-y-3">
                {courseHighlights.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-orange-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-accent-orange-500" />
                    </div>
                    <span className="text-text-secondary text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ChevronRight,
  Home,
  BookOpen,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Settings2,
  Clock,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Camera,
  Video,
  Send,
  ThumbsUp,
  AlertCircle,
  Lightbulb,
  Hand,
  Move,
  ArrowLeft,
  ArrowRight,
  Award,
  UserCheck,
  Sparkles,
  CheckCircle,
  XCircle,
  FileVideo,
} from 'lucide-react';
import { useCourseStore } from '@/stores/courseStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TagChip } from '@/components/ui/TagChip';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import type { Lesson, SubmittedExercise } from '@/types';
import { mockLessons } from '@/mock/data';
import { useCompletedLessonSet, markLessonVisited } from '@/lib/useCompletedLessons';
import { cn } from '@/lib/utils';

const gestureMarkers = [
  { id: 1, time: 45, title: '手势一', handShape: '手掌平放，四指并拢',
    position: '胸前正中位置，高度与肩平',
    movement: '从内向外轻轻挥动两次' },
  { id: 2, time: 120, title: '手势二', handShape: '拇指翘起，其余握拳',
    position: '右肩前方30cm处',
    movement: '顺时针画圈后向前推出' },
  { id: 3, time: 210, title: '手势三', handShape: '食指伸直，其他弯曲',
    position: '胸前偏左位置',
    movement: '从上向下划动至腹部' },
  { id: 4, time: 300, title: '手势四', handShape: '双手合十状，掌心相对',
    position: '面部正前方约20cm',
    movement: '双手同时向两侧分开再合拢' },
];

const mockTeachers: Record<string, { name: string; avatar: string; title: string }> = {
  c001: { name: '王静怡', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', title: '国家一级手语翻译' },
  c002: { name: '张伟', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', title: '高级手语教师' },
  c003: { name: '李晓红', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', title: '医疗手语专家' },
  c004: { name: '陈建国', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', title: '职场手语培训师' },
  c005: { name: '刘美玲', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', title: '特殊教育硕士' },
  c006: { name: '赵志强', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', title: '执业律师' },
  c007: { name: '周慧敏', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face', title: '心理咨询师' },
  c008: { name: '孙鹏飞', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face', title: '旅行手语达人' },
};

const teacherFeedbacks = [
  {
    id: 1,
    status: 'pass' as const,
    title: '第1题：问候手势',
    comment: '动作非常标准！手型准确，位置也很到位。特别是手掌挥动的幅度和节奏都掌握得很好，继续保持！',
    score: 95,
    highlights: ['手掌放平正确', '挥动幅度标准', '表情配合自然'],
  },
  {
    id: 2,
    status: 'improve' as const,
    title: '第2题：感谢手势',
    comment: '整体动作不错，但拇指翘起时手腕可以再放松一些。建议对着镜子多练习手腕的灵活性，注意动作的流畅度还有提升空间。',
    score: 78,
    improvements: ['手腕稍显僵硬', '动作幅度略快'],
  },
];

const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function CoursePlayer() {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { currentCourse, currentLesson, fetchCourse, fetchLesson, markLessonComplete, submitExercise, currentSubmittedExercise, fetchSubmittedExercise, loading } = useCourseStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isPracticeExpanded, setIsPracticeExpanded] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (courseId) fetchCourse(courseId);
  }, [courseId, fetchCourse]);

  useEffect(() => {
    if (lessonId) {
      fetchLesson(lessonId);
      fetchSubmittedExercise(lessonId);
    }
  }, [lessonId, fetchLesson, fetchSubmittedExercise]);

  useEffect(() => {
    if (courseId && lessonId) {
      markLessonVisited(courseId, lessonId);
    }
  }, [courseId, lessonId]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const duration = currentLesson?.duration || 600;
        if (prev >= duration) {
          setIsPlaying(false);
          return duration;
        }
        return prev + playbackSpeed;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, currentLesson?.duration]);

  useEffect(() => {
    let activeId: number | null = null;
    for (let i = gestureMarkers.length - 1; i >= 0; i--) {
      if (currentTime >= gestureMarkers[i].time) {
        activeId = gestureMarkers[i].id;
        break;
      }
    }
    setActiveMarkerId(activeId);
  }, [currentTime]);

  const completedSet = useCompletedLessonSet();

  const lessons: Lesson[] = useMemo(() => {
    if (!courseId) return [];
    const raw = mockLessons[courseId] || [];
    return raw.map((l) => ({ ...l, completed: completedSet.has(l.id) }));
  }, [courseId, completedSet]);

  if (!courseId || !lessonId) {
    return (
      <div className="min-h-full flex items-center justify-center py-24">
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">参数错误</h3>
          <p className="text-text-tertiary mb-6">课程或课时参数缺失</p>
          <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="min-h-full flex items-center justify-center py-24">
        <div className="text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">课程不存在</h3>
          <p className="text-text-tertiary mb-6">找不到该课程或该课程暂无课时</p>
          <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
        </div>
      </div>
    );
  }

  if (loading && !currentLesson) {
    return (
      <div className="min-h-full flex items-center justify-center py-24">
        <div className="text-text-tertiary">加载中...</div>
      </div>
    );
  }

  const handleMarkComplete = async () => {
    if (!lessonId) return;
    await markLessonComplete(lessonId, {
      courseId: courseId || '',
      lessonTitle: currentLesson?.title || '',
    });
  };

  const handleSubmitExercise = async () => {
    if (!lessonId || isSubmitting) return;
    if (!isRecording) {
      alert('请先录制练习视频后再提交');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitExercise({
        exerciseId: lessonId,
        answer: 'recorded_video',
      });
      if (res) {
        setSubmitSuccess(true);
        setIsRecording(false);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitted: SubmittedExercise | null = currentSubmittedExercise;

  const feedbackList = submitted
    ? [
        {
          id: submitted.id,
          status: submitted.status === 'approved' ? ('pass' as const) : ('improve' as const),
          title: `${currentLesson?.title || '本次练习'} · 手势练习`,
          comment: submitted.feedback || '',
          score: submitted.score || 0,
          highlights: submitted.highlights || [],
          improvements: submitted.improvements || [],
          gradedBy: submitted.gradedBy,
          gradedAt: submitted.gradedAt,
        },
      ]
    : [];

  const teacher = courseId
    ? mockTeachers[courseId] || { name: '专业教师', avatar: '', title: '' }
    : { name: '专业教师', avatar: '', title: '' };

  const duration = currentLesson?.duration || 600;
  const currentLessonIdx = lessons.findIndex((l) => l.id === lessonId);
  const hasPrev = currentLessonIdx > 0;
  const hasNext = currentLessonIdx >= 0 && currentLessonIdx < lessons.length - 1;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    setCurrentTime(Math.max(0, Math.min(duration, percent * duration)));
  };

  const handleMarkerClick = (markerTime: number) => {
    setCurrentTime(markerTime);
    setIsPlaying(true);
  };

  const jumpToLesson = (targetLessonId: string) => {
    navigate(`/courses/${courseId}/learn/${targetLessonId}`);
  };

  const goToPrevLesson = () => {
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx > 0) jumpToLesson(lessons[idx - 1].id);
  };

  const goToNextLesson = () => {
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx < lessons.length - 1) jumpToLesson(lessons[idx + 1].id);
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-12">
      <div className="bg-surface-card border-b border-surface-border/60">
        <div className="container max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-text-secondary overflow-x-auto">
            <Link to="/" className="flex items-center gap-1 hover:text-primary-600 transition-colors shrink-0">
              <Home className="w-4 h-4" />
              <span>首页</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-surface-muted shrink-0" />
            <Link to="/courses" className="hover:text-primary-600 transition-colors shrink-0">
              全部课程
            </Link>
            <ChevronRight className="w-4 h-4 text-surface-muted shrink-0" />
            <Link
              to={`/courses/${courseId}`}
              className="hover:text-primary-600 transition-colors line-clamp-1 max-w-[200px] shrink-0"
            >
              {currentCourse?.title || '课程详情'}
            </Link>
            <ChevronRight className="w-4 h-4 text-surface-muted shrink-0" />
            <span className="text-text-primary font-medium line-clamp-1">
              {currentLesson?.title || '课时学习'}
            </span>
          </nav>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden animate-fade-in-up">
              <div className="relative aspect-video bg-gradient-hero overflow-hidden group">
                <div className="absolute inset-0">
                  <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-white/10 blur-3xl animate-float" />
                  <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-accent-mint-400/20 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={cn(
                      'w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300',
                      isPlaying
                        ? 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                        : 'bg-accent-orange-500/90 hover:bg-accent-orange-600 shadow-elevation hover:scale-105'
                    )}
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" />
                    ) : (
                      <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" fill="currentColor" />
                    )}
                  </button>
                </div>

                {gestureMarkers.map((marker) => {
                  const position = (marker.time / duration) * 100;
                  return (
                    <button
                      key={marker.id}
                      onClick={() => handleMarkerClick(marker.time)}
                      className={cn(
                        'absolute bottom-20 w-5 h-5 rounded-full border-4 border-white -translate-x-1/2 transition-all duration-300 z-10',
                        activeMarkerId === marker.id
                          ? 'bg-accent-orange-500 scale-125 shadow-lg animate-breathe'
                          : 'bg-accent-orange-300 hover:bg-accent-orange-400 hover:scale-110'
                      )}
                      style={{ left: `${position}%` }}
                      title={`${marker.title} - ${formatTime(marker.time)}`}
                    />
                  );
                })}

                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <Badge variant="warning" className="bg-black/40 text-white border-white/30 backdrop-blur-sm">
                    <FileVideo className="w-3 h-3 mr-1" />
                    高清教学视频
                  </Badge>
                </div>

                <div className="absolute inset-x-0 bottom-0 px-4 md:px-6 py-4 z-20">
                  <div
                    className="relative h-2 bg-white/20 rounded-full cursor-pointer mb-4 group/progress"
                    onClick={handleSeek}
                  >
                    <div
                      className="absolute h-full bg-gradient-accent rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover/progress:opacity-100"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                    {gestureMarkers.map((marker) => {
                      const position = (marker.time / duration) * 100;
                      return (
                        <div
                          key={marker.id}
                          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 border-2 border-accent-orange-500"
                          style={{ left: `${position}%` }}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3 md:gap-4">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-accent-orange-300 transition-colors">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      <button onClick={goToPrevLesson} disabled={!hasPrev} className={cn('transition-colors', hasPrev ? 'hover:text-accent-orange-300' : 'opacity-30 cursor-not-allowed')} title="上一课">
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button onClick={goToNextLesson} disabled={!hasNext} className={cn('transition-colors', hasNext ? 'hover:text-accent-orange-300' : 'opacity-30 cursor-not-allowed')} title="下一课">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                      <button onClick={() => setIsMuted(!isMuted)} className="hover:text-accent-orange-300 transition-colors">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <span className="text-sm font-medium tabular-nums text-white/90">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="relative">
                        <button
                          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                          className="flex items-center gap-1 text-sm font-semibold hover:text-accent-orange-300 transition-colors"
                        >
                          <Settings2 className="w-5 h-5" />
                          <span className="hidden md:inline">{playbackSpeed}x</span>
                        </button>
                        {showSpeedMenu && (
                          <div className="absolute bottom-full right-0 mb-2 bg-surface-card rounded-lg shadow-elevation border border-surface-border/60 py-2 min-w-[100px] z-50 animate-scale-in">
                            {speedOptions.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => {
                                  setPlaybackSpeed(speed);
                                  setShowSpeedMenu(false);
                                }}
                                className={cn(
                                  'w-full px-4 py-2 text-sm text-left hover:bg-surface-bg transition-colors',
                                  playbackSpeed === speed
                                    ? 'text-accent-orange-500 font-semibold bg-accent-orange-50'
                                    : 'text-text-secondary'
                                )}
                              >
                                {speed}x 倍速
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="hover:text-accent-orange-300 transition-colors">
                        <Maximize2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-up stagger-1">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                  {currentLesson?.title || '课时标题'}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-tertiary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    时长：{formatTime(duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    第 {currentLessonIdx + 1} / {lessons.length} 课
                  </span>
                  {currentLesson?.completed && (
                    <Badge variant="success" dot>已完成学习</Badge>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={goToPrevLesson} disabled={!hasPrev}>
                  上一课
                </Button>
                <Button
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleMarkComplete}
                  disabled={currentLesson?.completed}
                  variant={currentLesson?.completed ? 'secondary' : 'primary'}
                >
                  {currentLesson?.completed ? '已完成 ✓' : '标记完成'}
                </Button>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={goToNextLesson} disabled={!hasNext}>
                  下一课
                </Button>
              </div>
            </div>

            <Card className="animate-fade-in-up stagger-2">
              <div className="p-5 border-b border-surface-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent-orange-100 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-accent-orange-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-text-primary">动作要点</h2>
                  <p className="text-sm text-text-tertiary">跟随视频时间轴，重点学习关键手势动作</p>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {gestureMarkers.map((marker, idx) => {
                  const isActive = activeMarkerId === marker.id;
                  const isPassed = activeMarkerId !== null && activeMarkerId > marker.id;
                  return (
                    <div
                      key={marker.id}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                        isActive
                          ? 'border-accent-orange-400 bg-accent-orange-50 shadow-md'
                          : isPassed
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-surface-border bg-surface-card hover:border-primary-200'
                      )}
                      onClick={() => handleMarkerClick(marker.time)}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0',
                              isActive
                                ? 'bg-accent-orange-500 text-white animate-breathe'
                                : isPassed
                                ? 'bg-emerald-500 text-white'
                                : 'bg-surface-bg text-text-secondary'
                            )}
                          >
                            {isPassed ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h3 className={cn('font-bold', isActive ? 'text-accent-orange-600' : 'text-text-primary')}>
                                {marker.title}
                              </h3>
                              <Badge variant="default" className="text-xs">
                                {formatTime(marker.time)}
                              </Badge>
                              {isActive && (
                                <Badge variant="warning" className="bg-accent-orange-500 text-white border-accent-orange-500">
                                  当前讲解中
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkerClick(marker.time);
                          }}
                          className="shrink-0"
                        >
                          <Play className="w-5 h-5 text-text-tertiary hover:text-accent-orange-500 transition-colors" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Hand className="w-4 h-4 text-primary-500" />
                            <span className="text-xs font-semibold text-text-secondary">手型</span>
                          </div>
                          <p className="text-sm text-text-primary">{marker.handShape}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Move className="w-4 h-4 text-accent-mint-500" />
                            <span className="text-xs font-semibold text-text-secondary">位置</span>
                          </div>
                          <p className="text-sm text-text-primary">{marker.position}</p>
                        </div>
                        <div className="p-3 bg-white rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-accent-orange-500" />
                            <span className="text-xs font-semibold text-text-secondary">运动轨迹</span>
                          </div>
                          <p className="text-sm text-text-primary">{marker.movement}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card className="animate-fade-in-up stagger-3">
              <button
                onClick={() => setIsPracticeExpanded(!isPracticeExpanded)}
                className="w-full p-5 border-b border-surface-border/60 flex items-center justify-between text-left hover:bg-surface-bg/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-text-primary">练习录制区</h2>
                    <p className="text-sm text-text-tertiary">跟随标准动作对照练习，系统自动批改</p>
                  </div>
                </div>
                {isPracticeExpanded ? (
                  <ChevronUp className="w-6 h-6 text-text-tertiary shrink-0" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-text-tertiary shrink-0" />
                )}
              </button>

              {isPracticeExpanded && (
                <div className="p-5 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-text-primary flex items-center gap-2">
                          <Video className="w-4 h-4 text-primary-500" />
                          标准动作演示
                        </h3>
                        <TagChip size="sm" variant="primary">参考视频</TagChip>
                      </div>
                      <div className="aspect-video bg-gradient-mint rounded-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0">
                          <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-white/20 blur-2xl animate-float" />
                        </div>
                        <div className="text-center text-white relative z-10">
                          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-8 h-8 ml-1" />
                          </div>
                          <p className="text-sm font-medium">点击播放标准动作</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-text-primary flex items-center gap-2">
                          <Camera className="w-4 h-4 text-accent-orange-500" />
                          我的练习
                        </h3>
                        {isRecording && (
                          <Badge variant="danger" dot className="animate-pulse">录制中</Badge>
                        )}
                      </div>
                      <div className="aspect-video bg-gradient-accent rounded-xl flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0">
                          <div className="absolute bottom-1/4 left-1/4 w-32 h-32 rounded-full bg-white/15 blur-2xl animate-float" />
                        </div>
                        <div className="text-center text-white relative z-10">
                          <div
                            className={cn(
                              'w-20 h-20 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300',
                              isRecording ? 'bg-red-500/80 animate-breathe' : 'bg-white/20 backdrop-blur-sm'
                            )}
                          >
                            <Camera className="w-10 h-10" />
                          </div>
                          <p className="text-base font-medium">
                            {isRecording ? '正在录制你的动作...' : '摄像头预览区'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                      size="lg"
                      variant={isRecording ? 'primary' : 'primary'}
                      leftIcon={isRecording ? <XCircle className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                      onClick={() => setIsRecording(!isRecording)}
                      className={cn(isRecording && '!bg-red-500 hover:!bg-red-600')}
                    >
                      {isRecording ? '停止录制' : '开始录制'}
                    </Button>
                    <Button
                      size="lg"
                      variant="secondary"
                      leftIcon={<Send className="w-5 h-5" />}
                      onClick={handleSubmitExercise}
                      loading={isSubmitting}
                      disabled={submitted?.status === 'approved'}
                    >
                      {submitSuccess ? '提交成功 ✓' : submitted?.status === 'approved' ? '已通过 ✓' : '提交作业'}
                    </Button>
                    {submitSuccess && (
                      <Badge variant="success" className="animate-pulse">批改完成！下方查看反馈</Badge>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card className="animate-fade-in-up stagger-4">
              <div className="p-5 border-b border-surface-border/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-text-primary">教师反馈</h2>
                  <p className="text-sm text-text-tertiary">
                    {submitted
                      ? submitted.gradedBy
                        ? `${submitted.gradedBy} · 最近一次批改结果`
                        : '最近一次批改结果'
                      : '尚未提交作业，完成录制后点击提交即可获得反馈'}
                  </p>
                </div>
                {submitted ? (
                  <Badge variant={submitted.status === 'approved' ? 'success' : 'warning'}>
                    {submitted.status === 'approved' ? '已通过' : '待改进'}
                  </Badge>
                ) : (
                  <Badge variant="default">待提交</Badge>
                )}
              </div>
              <div className="p-5 space-y-4">
                {feedbackList.length === 0 && !isSubmitting && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-bg flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-surface-muted" />
                    </div>
                    <h3 className="font-bold text-text-primary mb-2">暂无批改记录</h3>
                    <p className="text-sm text-text-tertiary max-w-sm mx-auto">
                      在上方练习录制区完成动作录制后，点击「提交作业」即可获得系统AI即时反馈与评分。
                    </p>
                  </div>
                )}
                {feedbackList.map((feedback) => (
                  <CardBody
                    key={feedback.id}
                    className={cn(
                      '!p-5 border rounded-xl',
                      feedback.status === 'pass'
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-amber-200 bg-amber-50/30'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                          feedback.status === 'pass'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-amber-500 text-white'
                        )}
                      >
                        {feedback.status === 'pass' ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <AlertCircle className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-text-primary mb-1">{feedback.title}</h3>
                            <Badge variant={feedback.status === 'pass' ? 'success' : 'warning'}>
                              {feedback.status === 'pass' ? '通过 ✓' : '待改进'}
                            </Badge>
                          </div>
                          <div className="flex items-baseline gap-1 shrink-0">
                            <span className="text-2xl font-bold text-text-primary">{feedback.score}</span>
                            <span className="text-text-tertiary">/100</span>
                          </div>
                        </div>
                        <p className="text-text-secondary leading-relaxed mb-4">{feedback.comment}</p>
                        {feedback.highlights && (
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-emerald-700 mb-2 flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              做得好的地方：
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {feedback.highlights.map((h, i) => (
                                <TagChip key={i} size="sm" variant="success">{h}</TagChip>
                              ))}
                            </div>
                          </div>
                        )}
                        {feedback.improvements && (
                          <div>
                            <p className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-1">
                              <Lightbulb className="w-4 h-4" />
                              需要改进：
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {feedback.improvements.map((h, i) => (
                                <TagChip key={i} size="sm" variant="warning">{h}</TagChip>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-in-up stagger-5">
              <div className="p-5 border-b border-surface-border/60">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  课程目录
                </h3>
              </div>
              <div className="p-3 max-h-[500px] overflow-y-auto">
                {lessons.map((lesson, idx) => {
                  const isCurrent = lesson.id === lessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => jumpToLesson(lesson.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3 rounded-lg mb-1 transition-all duration-200 text-left',
                        isCurrent
                          ? 'bg-accent-orange-50 border border-accent-orange-200'
                          : 'hover:bg-surface-bg'
                      )}
                    >
                      <div className="shrink-0">
                        {lesson.completed ? (
                          <CheckCircle2 className={cn(
                            'w-6 h-6',
                            isCurrent ? 'text-accent-orange-500' : 'text-emerald-500'
                          )} />
                        ) : isCurrent ? (
                          <div className="w-6 h-6 rounded-full bg-accent-orange-500 flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-surface-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-semibold truncate',
                          isCurrent ? 'text-accent-orange-600' : 'text-text-primary'
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          第{idx + 1}课 · {Math.floor(lesson.duration / 60)}分
                        </p>
                      </div>
                      {isCurrent && (
                        <Badge variant="warning" className="bg-accent-orange-500 text-white border-accent-orange-500 shrink-0">
                          当前
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="animate-fade-in-up stagger-6">
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar src={teacher.avatar} alt={teacher.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text-primary truncate">{teacher.name}</h3>
                    <p className="text-xs text-accent-orange-500 font-medium truncate">{teacher.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm mb-4 pt-4 border-t border-surface-border/60">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-primary-500" />
                    <span className="text-text-tertiary">资质认证</span>
                  </div>
                  <Badge variant="success">已认证</Badge>
                </div>
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary">授课课程</span>
                    <span className="font-semibold text-text-primary">8 门</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary">学员总数</span>
                    <span className="font-semibold text-text-primary">3.2万+</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-tertiary">平均评分</span>
                    <span className="font-semibold text-accent-orange-500">4.9</span>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">查看教师主页</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

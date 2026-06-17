import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  Clock,
  Users,
  Play,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useCourseStore } from '@/stores/courseStore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TagChip } from '@/components/ui/TagChip';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';

const levelOptions = [
  { value: 'all', label: '全部' },
  { value: 'beginner', label: '入门' },
  { value: 'intermediate', label: '初级' },
  { value: 'advanced', label: '中级' },
];

const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: '日常生活', label: '日常生活' },
  { value: '医疗就诊', label: '医疗' },
  { value: '职场沟通', label: '职场' },
  { value: '教育学习', label: '教育' },
  { value: '法律事务', label: '法律' },
];

const sortOptions = [
  { value: 'newest', label: '最新' },
  { value: 'rating', label: '评分最高' },
  { value: 'popular', label: '学习人数最多' },
];

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

const mockTeachers: Record<string, { name: string; avatar: string }> = {
  c001: { name: '王静怡老师', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face' },
  c002: { name: '张伟老师', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  c003: { name: '李晓红老师', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
  c004: { name: '陈建国老师', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' },
  c005: { name: '刘美玲老师', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face' },
  c006: { name: '赵志强律师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  c007: { name: '周慧敏老师', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face' },
  c008: { name: '孙鹏飞老师', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face' },
};

const mockPrices: Record<string, string> = {
  c001: '免费',
  c002: '¥99',
  c003: '¥199',
  c004: '¥299',
  c005: '¥149',
  c006: '¥399',
  c007: '免费',
  c008: '¥179',
};

export default function CourseList() {
  const navigate = useNavigate();
  const { courses, fetchCourses } = useCourseStore();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    if (selectedLevel !== 'all') {
      result = result.filter((c) => c.level === selectedLevel);
    }

    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(kw) ||
          c.description.toLowerCase().includes(kw) ||
          c.tags.some((t) => t.toLowerCase().includes(kw))
      );
    }

    switch (selectedSort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.students - a.students);
        break;
      default:
        break;
    }

    return result;
  }, [courses, selectedLevel, selectedCategory, selectedSort, searchKeyword]);

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}小时${m > 0 ? `${m}分` : ''}` : `${m}分钟`;
  };

  const formatCount = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
    return String(n);
  };

  return (
    <div className="min-h-screen bg-surface-bg pb-12">
      <div className="bg-gradient-hero text-white px-6 py-10 animate-fade-in">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3 animate-fade-in-up">
            <BookOpen className="w-8 h-8" />
            <h1 className="text-3xl font-bold">全部课程</h1>
          </div>
          <p className="text-white/80 text-lg mb-6 animate-fade-in-up stagger-1">
            探索系统化的手语学习路径，从入门到精通，助你无障碍沟通
          </p>
          <div className="max-w-2xl animate-fade-in-up stagger-2">
            <Input
              placeholder="搜索课程名称、标签或关键词..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              leftIcon={<Search className="w-5 h-5 text-surface-muted" />}
              className="!py-3.5 !rounded-xl !bg-white/95 !border-0 !text-text-primary placeholder:!text-surface-muted shadow-elevation"
            />
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 mt-6">
        <Card className="p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-semibold text-text-secondary">难度筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {levelOptions.map((opt) => (
                  <TagChip
                    key={opt.value}
                    variant="primary"
                    selected={selectedLevel === opt.value}
                    onClick={() => setSelectedLevel(opt.value)}
                  >
                    {opt.label}
                  </TagChip>
                ))}
              </div>
            </div>
            <div className="h-px lg:h-auto lg:w-px bg-surface-border lg:mx-2" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-semibold text-text-secondary">分类筛选</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categoryOptions.map((opt) => (
                  <TagChip
                    key={opt.value}
                    variant="primary"
                    selected={selectedCategory === opt.value}
                    onClick={() => setSelectedCategory(opt.value)}
                  >
                    {opt.label}
                  </TagChip>
                ))}
              </div>
            </div>
            <div className="h-px lg:h-auto lg:w-px bg-surface-border lg:mx-2" />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ArrowUpDown className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-semibold text-text-secondary">排序方式</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((opt) => (
                  <TagChip
                    key={opt.value}
                    variant="warning"
                    selected={selectedSort === opt.value}
                    onClick={() => setSelectedSort(opt.value)}
                  >
                    {opt.label}
                  </TagChip>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mb-5 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-accent-orange-500" />
            <span className="text-text-primary font-semibold">
              共找到 <span className="text-accent-orange-500">{filteredCourses.length}</span> 门课程
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course, idx: number) => {
            const teacher = mockTeachers[course.id] || { name: '专业教师', avatar: '' };
            const price = mockPrices[course.id] || '免费';
            const isFree = price === '免费';
            const progress = course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
            const isLearning = progress > 0;

            return (
              <Card
                key={course.id}
                hoverable
                className="cursor-pointer overflow-hidden group animate-fade-in-up"
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <div className="relative">
                  <div
                    className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${course.cover})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <TagChip
                      variant={levelVariantMap[course.level]}
                      size="sm"
                      selected
                    >
                      {levelTextMap[course.level]}
                    </TagChip>
                    {isLearning && (
                      <Badge variant="warning" className="bg-accent-orange-500 text-white border-accent-orange-500">
                        学习中
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge
                      variant={isFree ? 'success' : 'warning'}
                      className={cn(
                        'font-bold text-sm px-3 py-1.5',
                        isFree ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/95 text-accent-orange-600 border-white'
                      )}
                    >
                      {price}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-accent-orange-500/90 backdrop-blur-sm flex items-center justify-center shadow-elevation group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <div className="flex items-center gap-3 text-white text-xs">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDuration(course.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.totalLessons}课时
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={teacher.avatar} alt={teacher.name} size="sm" />
                    <span className="text-sm text-text-secondary font-medium">{teacher.name}</span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-accent-orange-500 transition-colors">
                    {course.title}
                  </h3>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.tags.slice(0, 3).map((tag) => (
                      <TagChip key={tag} size="sm" variant="default">
                        {tag}
                      </TagChip>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent-yellow-500 fill-accent-yellow-500" />
                      <span className="font-bold text-text-primary">{course.rating}</span>
                      <span className="text-xs text-text-tertiary ml-1">
                        ({formatCount(course.students)}人学)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-tertiary">
                      <Users className="w-3.5 h-3.5" />
                      <span>{formatCount(course.students)}学员</span>
                    </div>
                  </div>

                  {isLearning && (
                    <div className="mb-4">
                      <ProgressBar
                        value={course.completedLessons}
                        max={course.totalLessons}
                        color="orange"
                        showPercentage
                        size="sm"
                        label={`已学 ${course.completedLessons}/${course.totalLessons}`}
                      />
                    </div>
                  )}

                  <Button
                    variant={isLearning ? 'primary' : 'secondary'}
                    className="w-full"
                    rightIcon={!isLearning ? <Play className="w-4 h-4" /> : undefined}
                  >
                    {isLearning ? '继续学习' : '开始学习'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface-bg flex items-center justify-center">
              <Search className="w-12 h-12 text-surface-muted" />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">暂无匹配的课程</h3>
            <p className="text-text-tertiary mb-6">试试调整筛选条件或搜索其他关键词</p>
            <Button
              onClick={() => {
                setSelectedLevel('all');
                setSelectedCategory('all');
                setSearchKeyword('');
              }}
            >
              重置筛选条件
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

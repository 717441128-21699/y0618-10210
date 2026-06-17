import { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  Home,
  Stethoscope,
  Briefcase,
  GraduationCap,
  Scale,
  TrendingUp,
  Eye,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TagChip } from '@/components/ui/TagChip';
import { Input } from '@/components/ui/Input';
import { useVocabStore } from '@/stores/vocabStore';
import type { Word } from '@/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CategoryConfig {
  key: string;
  name: string;
  icon: React.ReactNode;
  gradient: string;
  description: string;
  subs: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    key: 'daily',
    name: '日常生活',
    icon: <Home className="w-7 h-7" />,
    gradient: 'from-orange-400 via-amber-400 to-orange-500',
    description: '衣食住行全方位日常手语',
    subs: ['称谓', '饮食', '服饰', '居住', '出行', '娱乐', '天气', '时间'],
  },
  {
    key: 'medical',
    name: '医疗就诊',
    icon: <Stethoscope className="w-7 h-7" />,
    gradient: 'from-emerald-400 via-teal-400 to-cyan-500',
    description: '医院就医流程专业手语',
    subs: ['挂号', '症状', '药品', '检查', '住院', '身体部位'],
  },
  {
    key: 'business',
    name: '职场沟通',
    icon: <Briefcase className="w-7 h-7" />,
    gradient: 'from-blue-500 via-indigo-500 to-blue-700',
    description: '求职面试工作商务手语',
    subs: ['求职面试', '办公用语', '会议发言', '商务谈判', '同事相处'],
  },
  {
    key: 'education',
    name: '教育学习',
    icon: <GraduationCap className="w-7 h-7" />,
    gradient: 'from-yellow-400 via-amber-400 to-yellow-500',
    description: '校园课堂教育场景手语',
    subs: ['学科知识', '校园生活', '课堂用语', '考试升学', '图书馆'],
  },
  {
    key: 'legal',
    name: '法律事务',
    icon: <Scale className="w-7 h-7" />,
    gradient: 'from-purple-500 via-violet-500 to-fuchsia-600',
    description: '法律咨询维权专业手语',
    subs: ['法律术语', '诉讼流程', '合同协议', '权益保护', '调解仲裁'],
  },
];

const CATEGORY_NAME_MAP: Record<string, string> = {
  daily: '日常生活',
  medical: '医疗就诊',
  business: '职场沟通',
  education: '教育学习',
  legal: '法律事务',
};

const HISTORY_KEY = 'signlang_search_history';

export default function VocabularyHome() {
  const navigate = useNavigate();
  const { words, loading, fetchVocabulary } = useVocabStore();

  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hotWords, setHotWords] = useState<Word[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setSearchHistory(JSON.parse(raw));
    } catch {}
    fetchVocabulary();
  }, [fetchVocabulary]);

  useEffect(() => {
    if (words.length > 0) {
      const wordScore: Record<string, { word: Word; score: number }> = {};
      words.forEach((w, i) => {
        const base = Math.max(1, 500 - i);
        const diffBonus = w.difficulty === 'easy' ? 100 : w.difficulty === 'medium' ? 50 : 10;
        const favBonus = w.isFavorite ? 80 : 0;
        wordScore[w.id] = { word: w, score: base + diffBonus + favBonus + Math.floor(Math.random() * 200) };
      });
      const sorted = Object.values(wordScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((v) => v.word);
      setHotWords(sorted);
    }
  }, [words]);

  const addHistory = (kw: string) => {
    if (!kw.trim()) return;
    const next = [kw, ...searchHistory.filter((h) => h !== kw)].slice(0, 8);
    setSearchHistory(next);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleSearch = () => {
    addHistory(searchText);
    fetchVocabulary(undefined, searchText);
  };

  const handleHistoryClick = (kw: string) => {
    setSearchText(kw);
    addHistory(kw);
    fetchVocabulary(undefined, kw);
  };

  const clearHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {}
  };

  const getCategoryCount = (catName: string) =>
    words.filter((w) => w.category === catName).length;

  const totalWords = words.length;

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              手语词汇库
              <span className="ml-3 text-accent-orange-500 text-base font-normal align-middle">
                {totalWords > 0 && `共收录 ${totalWords} 个标准手语词汇`}
              </span>
            </h1>
            <p className="text-text-secondary">
              搜索、学习和收藏你需要的手语词汇，支持分类浏览与智能推荐
            </p>
          </div>

          <Card className="mb-8 p-6 bg-gradient-to-br from-primary-50 via-white to-accent-mint-50 border-none shadow-card">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
              <div className="flex-1 w-full">
                <Input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索手语词汇，如“你好”“医院”“谢谢”……"
                  leftIcon={<Search className="w-5 h-5" />}
                  className="!py-3.5 !text-base bg-white shadow-sm"
                />
              </div>
              <Button
                size="lg"
                onClick={handleSearch}
                leftIcon={<Search className="w-5 h-5" />}
                className="w-full lg:w-auto min-w-[120px]"
              >
                搜索
              </Button>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Clock className="w-4 h-4" />
                  <span>搜索历史</span>
                </div>
                {searchHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-text-tertiary hover:text-red-500 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    清空
                  </button>
                )}
              </div>
              {searchHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((h) => (
                    <TagChip
                      key={h}
                      onClick={() => handleHistoryClick(h)}
                      className="cursor-pointer"
                    >
                      <Clock className="w-3 h-3 opacity-60" />
                      {h}
                    </TagChip>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-surface-muted">暂无搜索记录，快去探索手语词汇吧～</p>
              )}
            </div>
          </Card>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-accent-orange-500" />
              <h2 className="text-xl font-bold text-text-primary">场景分类</h2>
              <span className="text-sm text-text-tertiary">点击切换查看子分类</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {CATEGORIES.map((cat, idx) => {
                const isSelected = selectedCategory === cat.key;
                const count = getCategoryCount(CATEGORY_NAME_MAP[cat.key]);
                return (
                  <div
                    key={cat.key}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={cn(
                      'animate-fade-in-up relative rounded-2xl overflow-hidden cursor-pointer group',
                      'transition-all duration-300 ease-out',
                      isSelected
                        ? 'ring-4 ring-offset-2 ring-primary-400 -translate-y-1 shadow-elevation'
                        : 'hover:-translate-y-1 hover:shadow-card-hover'
                    )}
                    onClick={() => {
                      setSelectedCategory(isSelected ? null : cat.key);
                      fetchVocabulary(CATEGORY_NAME_MAP[cat.key]);
                    }}
                  >
                    <div
                      className={cn(
                        'bg-gradient-to-br',
                        cat.gradient,
                        'p-6 text-white relative'
                      )}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-110 transition-transform duration-500" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center shadow-inner">
                            {cat.icon}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{count}</div>
                            <div className="text-xs opacity-80">个词汇</div>
                          </div>
                        </div>
                        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                          {cat.name}
                          <ChevronRight
                            className={cn(
                              'w-5 h-5 transition-transform duration-300 opacity-70',
                              isSelected && 'rotate-90'
                            )}
                          />
                        </h3>
                        <p className="text-sm opacity-90">{cat.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedCategory && (
              <div className="mt-6 p-5 bg-white rounded-2xl shadow-card border border-surface-border/60 animate-scale-in">
                <div className="flex items-center gap-2 mb-4">
                  {CATEGORIES.find((c) => c.key === selectedCategory)?.icon}
                  <h3 className="font-semibold text-text-primary">
                    {CATEGORIES.find((c) => c.key === selectedCategory)?.name} - 子分类
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.find((c) => c.key === selectedCategory)?.subs.map((sub) => {
                    const subCount = words.filter(
                      (w) => w.category === CATEGORY_NAME_MAP[selectedCategory!]
                    ).length;
                    return (
                      <TagChip
                        key={sub}
                        variant="primary"
                        onClick={() => {
                          fetchVocabulary(CATEGORY_NAME_MAP[selectedCategory!], sub);
                          setSearchText(sub);
                        }}
                        className="cursor-pointer !px-4 !py-2"
                      >
                        {sub}
                        <span className="ml-1 opacity-60 text-xs">
                          ({Math.max(1, Math.ceil(subCount / 6))})
                        </span>
                      </TagChip>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-bold text-text-primary">热门词汇 Top 10</h2>
              </div>
              <button
                onClick={() => navigate('/vocabulary/dictionary')}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                查看全部 <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Card className="overflow-hidden">
              {loading ? (
                <div className="p-12 text-center text-text-tertiary">加载中...</div>
              ) : hotWords.length === 0 ? (
                <div className="p-12 text-center text-text-tertiary">暂无热门词汇</div>
              ) : (
                <div className="divide-y divide-surface-border/60">
                  {hotWords.map((word, idx) => (
                    <div
                      key={word.id}
                      onClick={() => navigate(`/vocabulary/${word.id}`)}
                      className="flex items-center gap-4 p-4 hover:bg-primary-50/60 cursor-pointer transition-colors group"
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shrink-0',
                          idx < 3
                            ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md'
                            : 'bg-surface-border/40 text-text-secondary'
                        )}
                      >
                        {idx + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="text-lg font-bold text-text-primary">{word.word}</span>
                          <span className="text-sm text-text-tertiary font-mono">
                            {word.translation}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <TagChip size="sm" variant="primary">
                            {word.category}
                          </TagChip>
                          <TagChip
                            size="sm"
                            variant={
                              word.difficulty === 'easy'
                                ? 'success'
                                : word.difficulty === 'medium'
                                ? 'warning'
                                : 'danger'
                            }
                          >
                            {word.difficulty === 'easy'
                              ? '简单'
                              : word.difficulty === 'medium'
                              ? '中等'
                              : '困难'}
                          </TagChip>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vocabulary/${word.id}`);
                        }}
                        leftIcon={<Eye className="w-4 h-4" />}
                        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                      >
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

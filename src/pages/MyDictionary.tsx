import { useState, useEffect, useMemo } from 'react';
import {
  Heart,
  FolderPlus,
  Search,
  Grid3X3,
  List,
  SortAsc,
  Pencil,
  Trash2,
  Eye,
  Clock,
  Sparkles,
  Folder,
  Bookmark,
  ChevronDown,
  X,
  Check,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { TagChip } from '@/components/ui/TagChip';
import { Input } from '@/components/ui/Input';
import { useVocabStore } from '@/stores/vocabStore';
import type { Word, DictionaryGroup } from '@/types';
import { cn } from '@/lib/utils';

const GROUP_COLORS = [
  'from-orange-400 to-amber-500',
  'from-emerald-400 to-teal-500',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-violet-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-sky-500',
];

type ViewMode = 'grid' | 'list';
type SortMode = 'time' | 'pinyin' | 'category';

interface GroupWithWords {
  group: DictionaryGroup;
  words: (Word | undefined)[];
}

export default function MyDictionary() {
  const navigate = useNavigate();
  const {
    words,
    dictionary,
    loading,
    fetchVocabulary,
    fetchDictionary,
    createDictionaryGroup,
    toggleFavorite,
  } = useVocabStore();

  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('time');
  const [searchText, setSearchText] = useState('');
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  useEffect(() => {
    fetchVocabulary();
    fetchDictionary();
  }, [fetchVocabulary, fetchDictionary]);

  const favoriteWords = useMemo(() => words.filter((w) => w.isFavorite), [words]);

  const allGroups: (DictionaryGroup & { isAll?: boolean })[] = useMemo(() => {
    const allGroup = {
      id: 'all',
      name: '全部收藏',
      wordIds: favoriteWords.map((w) => w.id),
      createdAt: new Date().toISOString(),
      isAll: true,
    };
    const favGroup = {
      id: 'favorites',
      name: '默认收藏夹',
      wordIds: favoriteWords.map((w) => w.id),
      createdAt: new Date().toISOString(),
    };
    return [allGroup, favGroup, ...(dictionary?.groups || [])];
  }, [dictionary, favoriteWords]);

  const selectedGroup = allGroups.find((g) => g.id === selectedGroupId) || allGroups[0];

  const selectedWords = useMemo(() => {
    let result: Word[] = [];
    if (selectedGroup?.id === 'all' || selectedGroup?.id === 'favorites') {
      result = favoriteWords;
    } else {
      result = (selectedGroup?.wordIds || [])
        .map((id) => words.find((w) => w.id === id))
        .filter((w): w is Word => !!w);
    }

    if (searchText.trim()) {
      const kw = searchText.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(kw) ||
          w.translation.toLowerCase().includes(kw) ||
          w.category.includes(kw)
      );
    }

    const sorted = [...result];
    switch (sortMode) {
      case 'pinyin':
        sorted.sort((a, b) => a.word.localeCompare(b.word, 'zh-Hans-CN'));
        break;
      case 'category':
        sorted.sort((a, b) => a.category.localeCompare(b.category, 'zh-Hans-CN'));
        break;
      case 'time':
      default:
        break;
    }
    return sorted;
  }, [selectedGroup, favoriteWords, words, searchText, sortMode]);

  const SORT_OPTIONS: { key: SortMode; label: string; icon: React.ReactNode }[] = [
    { key: 'time', label: '按收藏时间', icon: <Clock className="w-4 h-4" /> },
    { key: 'pinyin', label: '按拼音排序', icon: <SortAsc className="w-4 h-4" /> },
    { key: 'category', label: '按场景分类', icon: <Folder className="w-4 h-4" /> },
  ];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getRandomDate = (wordId: string) => {
    const seed = wordId.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
    const daysAgo = seed % 90;
    return formatDate(new Date(Date.now() - daysAgo * 86400000).toISOString());
  };

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-text-primary mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-accent-orange-500" />
              我的手语词典
            </h1>
            <p className="text-text-secondary">
              管理你的收藏词汇，创建个性化学习分组，随时复习巩固
            </p>
          </div>

          <Card className="mb-6 p-5 bg-gradient-to-r from-primary-50 via-white to-accent-mint-50 border-none">
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-orange-500 to-orange-400 text-white flex items-center justify-center shadow-button">
                  <Heart className="w-8 h-8" fill="currentColor" />
                </div>
                <div>
                  <div className="text-sm text-text-secondary mb-1">我的收藏</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text-primary">
                      {favoriteWords.length}
                    </span>
                    <span className="text-sm text-text-tertiary">个词汇</span>
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">
                    共创建 {(dictionary?.groups?.length || 0) + 1} 个分组
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="w-full sm:w-72">
                  <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="搜索已收藏的词汇..."
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <Button
                  leftIcon={<FolderPlus className="w-4 h-4" />}
                  onClick={() => setShowNewGroupModal(true)}
                  className="w-full sm:w-auto"
                >
                  创建新分组
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="sticky top-6 overflow-hidden">
                <CardHeader className="!pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Folder className="w-5 h-5 text-primary-600" />
                    词典分组
                  </CardTitle>
                </CardHeader>
                <CardBody className="!pt-0 space-y-1.5">
                  {allGroups.map((g, idx) => {
                    const isSelected = selectedGroupId === g.id;
                    const colorIdx = idx % GROUP_COLORS.length;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedGroupId(g.id)}
                        className={cn(
                          'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 group',
                          isSelected
                            ? 'bg-primary-50 border-2 border-primary-200 shadow-sm'
                            : 'hover:bg-surface-bg border-2 border-transparent'
                        )}
                      >
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl bg-gradient-to-br shrink-0 flex items-center justify-center text-white shadow-sm',
                            g.isAll ? GROUP_COLORS[0] : GROUP_COLORS[colorIdx]
                          )}
                        >
                          {g.isAll ? (
                            <Sparkles className="w-5 h-5" />
                          ) : g.id === 'favorites' ? (
                            <Bookmark className="w-5 h-5" />
                          ) : (
                            <Folder className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              'font-semibold truncate',
                              isSelected ? 'text-primary-700' : 'text-text-primary'
                            )}
                          >
                            {g.name}
                          </div>
                          <div className="text-xs text-text-tertiary">
                            {g.wordIds.length} 个词汇
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-primary-600 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </CardBody>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-4">
              <Card className="overflow-hidden">
                <CardHeader className="!pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Folder className="w-5 h-5 text-primary-600" />
                        {selectedGroup?.name}
                      </CardTitle>
                      <p className="text-sm text-text-tertiary mt-1">
                        共 {selectedWords.length} 个词汇
                        {searchText && ` · 匹配 "${searchText}"`}
                      </p>
                    </div>
                    {selectedGroup && selectedGroup.id !== 'all' && selectedGroup.id !== 'favorites' && (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => {
                            setEditingGroupId(selectedGroup.id);
                            setEditingName(selectedGroup.name);
                          }}
                          className="p-2 rounded-lg hover:bg-primary-50 text-text-secondary hover:text-primary-600 transition-colors"
                          title="编辑名称"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"
                          title="删除分组"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<SortAsc className="w-4 h-4" />}
                        rightIcon={<ChevronDown className="w-4 h-4" />}
                        onClick={() => setShowSortDropdown((s) => !s)}
                      >
                        {SORT_OPTIONS.find((o) => o.key === sortMode)?.label}
                      </Button>
                      {showSortDropdown && (
                        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-elevation border border-surface-border/60 z-20 overflow-hidden min-w-[160px] animate-scale-in">
                          {SORT_OPTIONS.map((opt) => (
                            <button
                              key={opt.key}
                              onClick={() => {
                                setSortMode(opt.key);
                                setShowSortDropdown(false);
                              }}
                              className={cn(
                                'w-full flex items-center gap-2 px-4 py-2.5 text-sm transition-colors',
                                sortMode === opt.key
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'hover:bg-surface-bg text-text-secondary'
                              )}
                            >
                              {opt.icon}
                              {opt.label}
                              {sortMode === opt.key && <Check className="w-4 h-4 ml-auto" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex p-1 bg-surface-bg rounded-xl border border-surface-border/60">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          viewMode === 'grid'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-text-tertiary hover:text-text-secondary'
                        )}
                        title="网格视图"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                          'p-2 rounded-lg transition-all',
                          viewMode === 'list'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-text-tertiary hover:text-text-secondary'
                        )}
                        title="列表视图"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {loading ? (
                <Card>
                  <CardBody>
                    <div className="p-12 text-center text-text-tertiary">加载中...</div>
                  </CardBody>
                </Card>
              ) : selectedWords.length === 0 ? (
                <Card>
                  <CardBody>
                    <div className="p-16 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
                        <Heart className="w-10 h-10 text-primary-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        {searchText ? '没有找到匹配的词汇' : '这个分组还没有词汇'}
                      </h3>
                      <p className="text-sm text-text-tertiary mb-5">
                        {searchText
                          ? '试试换个关键词搜索吧'
                          : '快去词汇库收藏一些常用的手语词汇吧！'}
                      </p>
                      <Button onClick={() => navigate('/vocabulary')}>
                        去词汇库看看
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {selectedWords.map((word, idx) => (
                    <Card
                      key={word.id}
                      hoverable
                      className="overflow-hidden group animate-fade-in-up"
                      style={{ animationDelay: `${idx * 30}ms` }}
                      onClick={() => navigate(`/vocabulary/${word.id}`)}
                    >
                      <div className="relative aspect-video bg-gradient-to-br from-primary-100 via-primary-50 to-accent-mint-50 overflow-hidden">
                        <img
                          src={`https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(`手语词汇 ${word.word} 标准手势演示 清晰教学图`)}&image_size=landscape_4_3`}
                          alt={word.word}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/vocabulary/${word.id}`);
                            }}
                            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm text-primary-600 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                            title="查看详情"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(word.id);
                            }}
                            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm text-red-500 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                            title="取消收藏"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <TagChip
                            size="sm"
                            variant="primary"
                            className="backdrop-blur-sm bg-white/90 !text-primary-700 !border-primary-200"
                          >
                            {word.category}
                          </TagChip>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-2xl font-bold text-text-primary tracking-wide">
                            {word.word}
                          </h3>
                          <Heart
                            className="w-5 h-5 text-accent-orange-500 shrink-0 mt-1"
                            fill="currentColor"
                          />
                        </div>
                        <div className="text-sm text-text-tertiary font-mono mb-3">
                          {word.translation}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-surface-border/40">
                          <div className="flex items-center gap-1 text-xs text-text-tertiary">
                            <Clock className="w-3.5 h-3.5" />
                            {getRandomDate(word.id)}
                          </div>
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
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="overflow-hidden">
                  <div className="divide-y divide-surface-border/60">
                    {selectedWords.map((word, idx) => (
                      <div
                        key={word.id}
                        className="flex items-center gap-4 p-4 hover:bg-primary-50/50 transition-colors group animate-fade-in"
                        style={{ animationDelay: `${idx * 20}ms` }}
                      >
                        <div
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center font-bold text-2xl text-primary-700 shrink-0"
                          onClick={() => navigate(`/vocabulary/${word.id}`)}
                        >
                          {word.word.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/vocabulary/${word.id}`)}>
                          <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-xl font-bold text-text-primary">
                              {word.word}
                            </span>
                            <span className="text-sm text-text-tertiary font-mono">
                              {word.translation}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
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
                            <span className="text-xs text-text-tertiary flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              收藏于 {getRandomDate(word.id)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Eye className="w-4 h-4" />}
                            onClick={() => navigate(`/vocabulary/${word.id}`)}
                          >
                            查看
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => toggleFavorite(word.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {showNewGroupModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowNewGroupModal(false)}
        >
          <Card
            className="max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-primary-600" />
                新建词典分组
              </CardTitle>
              <button
                onClick={() => setShowNewGroupModal(false)}
                className="p-2 rounded-lg hover:bg-surface-bg text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="分组名称"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="例如：旅游出行、面试高频..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newGroupName.trim()) {
                    createDictionaryGroup(newGroupName.trim()).then(() => {
                      setNewGroupName('');
                      setShowNewGroupModal(false);
                    });
                  }
                }}
              />
              <div className="text-xs text-text-tertiary bg-primary-50 p-3 rounded-lg">
                💡 创建分组后，可以将词汇按学习主题归类，方便系统复习
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setShowNewGroupModal(false)}>
                  取消
                </Button>
                <Button
                  onClick={async () => {
                    if (newGroupName.trim()) {
                      await createDictionaryGroup(newGroupName.trim());
                      setNewGroupName('');
                      setShowNewGroupModal(false);
                    }
                  }}
                  disabled={!newGroupName.trim()}
                >
                  创建分组
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {editingGroupId && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setEditingGroupId(null)}
        >
          <Card
            className="max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-primary-600" />
                编辑分组名称
              </CardTitle>
              <button
                onClick={() => setEditingGroupId(null)}
                className="p-2 rounded-lg hover:bg-surface-bg text-text-tertiary hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="分组名称"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && editingName.trim()) {
                    setEditingGroupId(null);
                  }
                }}
              />
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setEditingGroupId(null)}>
                  取消
                </Button>
                <Button
                  onClick={() => {
                    if (editingName.trim()) setEditingGroupId(null);
                  }}
                  disabled={!editingName.trim()}
                >
                  保存
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

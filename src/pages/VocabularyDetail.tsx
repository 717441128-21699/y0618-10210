import { useState, useEffect } from 'react';
import {
  Heart,
  ChevronRight,
  Play,
  RotateCw,
  Gauge,
  Eye,
  ChevronLeft,
  FolderPlus,
  Lightbulb,
  Volume2,
  HeartOff,
  Trash2,
} from 'lucide-react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { TagChip } from '@/components/ui/TagChip';
import { useVocabStore } from '@/stores/vocabStore';
import { mockWords } from '@/mock/data';
import type { Word } from '@/types';
import { cn } from '@/lib/utils';

const IMG_API = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image';
const img = (prompt: string, size: 'landscape_16_9' | 'landscape_4_3' | 'portrait_4_3' | 'portrait_16_9' | 'square_hd' | 'square' = 'landscape_16_9') =>
  `${IMG_API}?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

type ViewAngle = '正面' | '侧面' | '手部特写';
const VIEW_ANGLES: ViewAngle[] = ['正面', '侧面', '手部特写'];

interface Step {
  step: number;
  title: string;
  description: string;
  tip: string;
}

const DIFFICULTY_CN: Record<string, string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export default function VocabularyDetail() {
  const { wordId } = useParams<{ wordId: string }>();
  const navigate = useNavigate();
  const { currentWord, words, loading, fetchWord, toggleFavorite, fetchDictionary, dictionary, createDictionaryGroup, fetchVocabulary,
  } = useVocabStore();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [slowMode, setSlowMode] = useState(false);
  const [viewAngle, setViewAngle] = useState<ViewAngle>('正面');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [favCount, setFavCount] = useState(0);
  const [word, setWord] = useState<Word | null>(null);

  useEffect(() => {
    if (wordId) fetchWord(wordId);
    fetchVocabulary();
    fetchDictionary();
  }, [wordId, fetchWord, fetchVocabulary, fetchDictionary]);

  useEffect(() => {
    if (currentWord) setWord(currentWord);
    setFavCount(Math.floor(Math.random() * 800) + 120);
  }, [currentWord]);

  const wordIdx = words.findIndex((w) => w.id === wordId);
  const relatedWords = word
    ? words
        .filter((w) => w.category === word.category && w.id !== word.id)
        .slice(0, 8)
    : [];

  const nextWord = wordIdx >= 0 && wordIdx < words.length - 1 ? words[wordIdx + 1] : null;

  const steps: Step[] = word
    ? [
        {
          step: 1,
          title: '准备手型',
          description: `双手自然放松，手心朝向身体前方，手指自然并拢，准备开始做「${word.word}」的第一个动作。`,
          tip: '💡 小提示：肩膀放松，不要耸肩，保持自然姿态',
        },
        {
          step: 2,
          title: '起始位置',
          description: `将右手抬起至胸前位置，手掌略微倾斜，手指保持自然弧度，这是「${word.word}」的标准起始位置。`,
          tip: '💡 小提示：手的高度大约与心脏同高，不要过高或过低',
        },
        {
          step: 3,
          title: '核心动作',
          description: `手腕轻轻向前方推出，同时配合手指的开合动作，完整表达「${word.word}」的语义。动作要流畅自然。`,
          tip: '💡 小提示：动作幅度适中，配合相应的面部表情会更自然',
        },
        {
          step: 4,
          title: '结束动作',
          description: `完成动作后，手回到自然位置，保持0.5秒再放下，确保对方看清完整的「${word.word}」手语表达。`,
          tip: '💡 小提示：结尾停顿很重要，让对方有时间理解',
        },
      ]
    : [];

  const exampleScenarios = word
    ? [
        {
          scene: '餐厅点餐',
          sentence: `「我想要${word.word}，请问多少钱？」`,
          thumb: img(`手语场景 餐厅点餐 手语沟通`, 'landscape_4_3'),
        },
        {
          scene: '日常问候',
          sentence: `「你好，很高兴认识你，${word.word}是我今天新学的手语！」`,
          thumb: img(`手语场景 日常交流 朋友见面`, 'landscape_4_3'),
        },
      ]
    : [];

  if (loading && !word) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="text-text-secondary">加载中...</div>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <Card className="max-w-md p-8 text-center">
          <p className="text-text-secondary mb-4">未找到该词汇</p>
          <Button onClick={() => navigate('/vocabulary')}>返回词汇库</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm mb-6 text-text-secondary animate-fade-in">
          <Link to="/vocabulary" className="hover:text-primary-600 transition-colors">
            词汇库
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-primary-600 transition-colors cursor-pointer">
            {word.category}
          </span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-text-primary font-medium">{word.word}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden animate-fade-in-up">
              <div className="relative w-full aspect-video bg-gradient-to-br from-primary-600 via-primary-500 to-accent-mint-500 overflow-hidden group">
                <div
                  className="absolute inset-0 bg-black/10"
                  style={{
                    backgroundImage: `url(${img(`手语词汇标准动作演示 ${word.word} 清晰教学图 正面视角`, 'landscape_16_9')}) center/cover no-repeat`,
                    backgroundBlendMode: 'overlay',
                    opacity: 0.35,
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className={cn(
                      'w-24 h-24 rounded-full bg-white/95 text-primary-600',
                      'flex items-center justify-center shadow-elevation',
                      'transition-all duration-300 hover:scale-110 active:scale-95',
                      isPlaying && 'animate-breathe'
                    )}
                  >
                    {isPlaying ? (
                      <div className="flex gap-1">
                      <div className="w-3 h-10 bg-primary-600 rounded-sm" />
                      <div className="w-3 h-10 bg-primary-600 rounded-sm" />
                    </div>
                    ) : (
                      <Play className="w-10 h-10 ml-2" fill="currentColor" />
                    )}
                  </button>
                  <div className="mt-6 text-white text-lg font-medium">
                    {isPlaying ? '正在播放 标准动作演示' : '点击播放 标准动作演示'}
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                  <button
                    onClick={() => setIsLooping((l) => !l)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm transition-all',
                      isLooping
                        ? 'bg-white text-primary-600 shadow-md'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <RotateCw className="w-4 h-4" />
                      循环
                    </div>
                  </button>
                  <button
                    onClick={() => setSlowMode((s) => !s)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm transition-all',
                      slowMode
                        ? 'bg-white text-primary-600 shadow-md'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <Gauge className="w-4 h-4" />
                      慢速
                    </div>
                  </button>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-1.5 bg-white/15 backdrop-blur-sm p-1 rounded-xl">
                  {VIEW_ANGLES.map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setViewAngle(angle)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                        viewAngle === angle
                          ? 'bg-white text-primary-600 shadow-md'
                          : 'text-white hover:bg-white/20'
                      )}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                {slowMode && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-accent-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-md animate-fade-in">
                    慢速播放模式 已开启
                  </div>
                )}
              </div>
            </Card>

            <Card className="animate-fade-in-up" style={{ animationDelay: '60ms' }}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-4xl font-bold text-primary-700 shrink-0">
                    {word.word.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-text-primary mb-1 tracking-wide">
                      {word.word}
                    </h1>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-lg text-text-secondary font-mono">
                        {word.translation}
                      </span>
                      <button className="text-primary-600 hover:text-primary-700 transition-colors">
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <TagChip variant="primary">{word.category}</TagChip>
                      <TagChip
                        variant={
                          word.difficulty === 'easy'
                            ? 'success'
                            : word.difficulty === 'medium'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        难度：{DIFFICULTY_CN[word.difficulty]}
                      </TagChip>
                      <TagChip variant="default">
                        <Heart className="w-3.5 h-3.5" />
                        {favCount} 人收藏
                      </TagChip>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="animate-fade-in-up" style={{ animationDelay: '120ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-accent-yellow-500" />
                <h2 className="text-xl font-bold text-text-primary">动作分解步骤</h2>
                <span className="text-sm text-text-tertiary">
                  （跟着步骤慢慢练习）
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {steps.map((s, idx) => (
                  <Card
                    key={s.step}
                    hoverable
                    className="p-0 overflow-hidden"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <div className="relative">
                      <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-gradient-to-br from-accent-orange-500 to-orange-400 text-white flex items-center justify-center font-bold text-lg shadow-md">
                        {s.step}
                      </div>
                      <img
                        src={img(
                          `手语动作分解 步骤${s.step} ${s.title} ${word.word} 手势特写 教学图`,
                          'landscape_4_3'
                        )}
                        alt={s.title}
                        className="w-full aspect-[4/3] object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-text-primary mb-2">{s.title}</h3>
                      <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                        {s.description}
                      </p>
                      <div className="text-xs text-accent-orange-600 bg-accent-orange-50 p-2.5 rounded-lg">
                        {s.tip}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Card className="animate-fade-in-up" style={{ animationDelay: '180ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-600" />
                  例句与用法
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {exampleScenarios.map((ex, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-xl bg-primary-50/60 hover:bg-primary-50 transition-colors cursor-pointer group"
                    >
                      <div className="relative shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-primary-200 to-primary-300">
                        <img
                          src={ex.thumb}
                          alt={ex.scene}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                          <Play className="w-8 h-8 text-white" fill="white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-text-primary mb-1.5">
                          场景：{ex.scene}
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {ex.sentence}
                        </p>
                        <div className="mt-2">
                          <TagChip size="sm" variant="primary">
                            点击观看视频
                          </TagChip>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {relatedWords.length > 0 && (
              <div className="animate-fade-in-up" style={{ animationDelay: '240ms' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-primary">相关词汇推荐</h2>
                  <span className="text-sm text-text-tertiary">
                    来自「{word.category}」分类
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1">
                  {relatedWords.map((rw, idx) => (
                    <Card
                      key={rw.id}
                      hoverable
                      className="shrink-0 w-48 cursor-pointer"
                      onClick={() => navigate(`/vocabulary/${rw.id}`)}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                        <img
                          src={img(`手语词汇 ${rw.word} 手势`, 'landscape_4_3')}
                          alt={rw.word}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <div className="font-bold text-lg text-text-primary mb-0.5">
                          {rw.word}
                        </div>
                        <div className="text-xs text-text-tertiary mb-2 font-mono">
                          {rw.translation}
                        </div>
                        <TagChip size="sm" variant="primary">
                          {rw.category}
                        </TagChip>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5 animate-slide-in-right">
            <Card className="sticky top-6">
              <CardBody className="space-y-5">
                <button
                  onClick={() => wordId && toggleFavorite(wordId)}
                  className={cn(
                    'w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300',
                    word.isFavorite
                      ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
                      : 'bg-gradient-to-r from-accent-orange-500 to-orange-400 text-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5'
                  )}
                >
                  {word.isFavorite ? (
                    <>
                      <HeartOff className="w-6 h-6" fill="currentColor" />
                      已收藏
                    </>
                  ) : (
                    <>
                      <Heart className="w-6 h-6" />
                      收藏词汇
                    </>
                  )}
                </button>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-surface-bg">
                    <div className="text-2xl font-bold text-primary-600">{favCount}</div>
                    <div className="text-xs text-text-tertiary">收藏数</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-bg">
                    <div className="text-2xl font-bold text-accent-orange-500">
                      {Math.floor(favCount * 3.7)}
                    </div>
                    <div className="text-xs text-text-tertiary">学习次数</div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-bg">
                    <div className="text-2xl font-bold text-accent-mint-600">
                      {word.difficulty === 'easy' ? '★' : word.difficulty === 'medium' ? '★★' : '★★★'}
                    </div>
                    <div className="text-xs text-text-tertiary">难度</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border/60">
                  <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-text-secondary flex items-center gap-1.5">
                    <FolderPlus className="w-4 h-4" />
                    添加到词典分组
                  </label>
                  <button
                    onClick={() => setShowGroupModal(true)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    新建分组
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {dictionary?.groups?.map?.((g) => {
                    const inGroup = g.wordIds.includes(word.id);
                    return (
                      <div
                        key={g.id}
                        className={cn(
                          'flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all',
                          inGroup
                            ? 'bg-primary-50 border border-primary-200'
                            : 'hover:bg-surface-bg border border-transparent'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-primary-400 to-primary-600" />
                          <span className="text-sm text-text-primary">{g.name}</span>
                        </div>
                        <span className="text-xs text-text-tertiary">
                          {g.wordIds.length} 词
                        </span>
                      </div>
                    );
                  })}
                  {!dictionary?.groups?.length && (
                    <p className="text-xs text-text-tertiary text-center py-3">
                      暂无分组
                    </p>
                  )}
                </div>
                </div>
              </CardBody>
            </Card>

            {nextWord && (
              <Card hoverable className="cursor-pointer" onClick={() => navigate(`/vocabulary/${nextWord.id}`)}>
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-text-secondary">下一个词汇</span>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center font-bold text-xl text-primary-700 shrink-0">
                      {nextWord.word.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-text-primary truncate">
                        {nextWord.word}
                      </div>
                      <div className="text-xs text-text-tertiary truncate">
                        {nextWord.category}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {showGroupModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
            <Card className="max-w-md w-full animate-scale-in">
              <CardHeader>
                <CardTitle>新建词典分组</CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="请输入分组名称"
                  className="w-full px-4 py-3 rounded-lg border-2 border-surface-border focus:border-primary-400 focus:outline-none focus:ring-4 focus:ring-primary-50 transition-all"
                />
                <div className="flex gap-3 justify-end">
                  <Button variant="ghost" onClick={() => setShowGroupModal(false)}>
                    取消
                  </Button>
                  <Button
                    onClick={async () => {
                      if (newGroupName.trim()) {
                        await createDictionaryGroup(newGroupName.trim());
                        setNewGroupName('');
                        setShowGroupModal(false);
                      }
                    }}
                  >
                    创建
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

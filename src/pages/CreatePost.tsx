import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Video,
  X,
  Trash2,
  Plus,
  Hash,
  Sparkles,
  CheckCircle2,
  Loader2,
  Camera,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TagChip } from '@/components/ui/TagChip';
import { useCommunityStore } from '@/stores/communityStore';
import { cn } from '@/lib/utils';

interface SubtitleItem {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

const steps = [
  { id: 1, name: '上传视频', icon: Upload },
  { id: 2, name: '生成字幕', icon: Sparkles },
  { id: 3, name: '编辑字幕', icon: FileText },
  { id: 4, name: '添加话题', icon: Hash },
];

const recommendedTopics = [
  '我的手语日常',
  '手语教学',
  '学习心得',
  '今日打卡',
  '求助翻译',
  '生活分享',
  '职场经验',
  '就医指南',
];

const initialSubtitles: SubtitleItem[] = [
  { id: 's1', startTime: '00:00', endTime: '00:02', text: '大家好' },
  { id: 's2', startTime: '00:02', endTime: '00:05', text: '今天教大家一个实用的手语' },
  { id: 's3', startTime: '00:05', endTime: '00:08', text: '这个手势表示你好吗' },
  { id: 's4', startTime: '00:08', endTime: '00:11', text: '跟我一起做' },
  { id: 's5', startTime: '00:11', endTime: '00:15', text: '学会了记得点赞收藏哦' },
];

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPost, loading } = useCommunityStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>(initialSubtitles);
  const [description, setDescription] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState('');

  useEffect(() => {
    if (currentStep === 2 && videoUploaded && !isGenerating) {
      setIsGenerating(true);
      setGeneratingProgress(0);
      const interval = setInterval(() => {
        setGeneratingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(3), 600);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [currentStep, videoUploaded, isGenerating]);

  const handleUploadVideo = () => {
    setVideoUploaded(true);
    setTimeout(() => setCurrentStep(2), 500);
  };

  const handleRecordVideo = () => {
    setVideoUploaded(true);
    setTimeout(() => setCurrentStep(2), 500);
  };

  const updateSubtitleText = (id: string, text: string) => {
    setSubtitles((prev) =>
      prev.map((s) => (s.id === id ? { ...s, text } : s))
    );
  };

  const removeSubtitle = (id: string) => {
    setSubtitles((prev) => prev.filter((s) => s.id !== id));
  };

  const addSubtitle = () => {
    const lastSub = subtitles[subtitles.length - 1];
    const newStart = lastSub ? lastSub.endTime : '00:15';
    const [min, sec] = newStart.split(':').map(Number);
    const newEndMin = sec + 3 >= 60 ? min + 1 : min;
    const newEndSec = sec + 3 >= 60 ? sec + 3 - 60 : sec + 3;
    const newEnd = `${String(newEndMin).padStart(2, '0')}:${String(newEndSec).padStart(2, '0')}`;
    setSubtitles((prev) => [
      ...prev,
      {
        id: `s${Date.now()}`,
        startTime: newStart,
        endTime: newEnd,
        text: '',
      },
    ]);
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const addCustomTopic = () => {
    if (newTopicInput.trim() && !selectedTopics.includes(newTopicInput.trim())) {
      setSelectedTopics((prev) => [...prev, newTopicInput.trim()]);
      setNewTopicInput('');
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handlePublish = async () => {
    await createPost({
      channel: 'share',
      title: description.slice(0, 50) || '分享我的手语视频',
      content: description || '分享手语学习内容',
    });
    setTimeout(() => navigate('/community'), 800);
  };

  return (
    <div className="min-h-full animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-card border border-surface-border/60 flex items-center justify-center text-text-secondary hover:text-primary-600 hover:shadow-card-hover transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold text-text-primary">发布新帖</h1>
      </div>

      <div className="mb-8 bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2',
                      isCompleted
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                        : isActive
                        ? 'bg-gradient-accent text-white border-accent-orange-400 shadow-button scale-110'
                        : 'bg-surface-bg text-surface-muted border-surface-border'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive ? 'text-primary-600' : isCompleted ? 'text-emerald-600' : 'text-text-tertiary'
                    )}
                  >
                    {step.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 rounded-full overflow-hidden bg-surface-border">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        currentStep > step.id ? 'w-full bg-emerald-500' : 'w-0'
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">上传或录制视频</h2>
            <p className="text-sm text-text-tertiary mb-8">
              支持 MP4、MOV、AVI 格式，时长建议 15 秒 - 5 分钟，不超过 500MB
            </p>

            <div
              onClick={handleUploadVideo}
              className={cn(
                'relative border-3 border-dashed rounded-3xl p-16 mb-6',
                'cursor-pointer transition-all duration-300 group',
                'border-primary-200 bg-primary-50/30',
                'hover:border-accent-orange-400 hover:bg-accent-orange-50/30 hover:shadow-elevation'
              )}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-accent-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:from-primary-200 group-hover:to-accent-orange-200 transition-all duration-300">
                  <Upload className="w-12 h-12 text-primary-600 group-hover:text-accent-orange-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">点击或拖拽上传视频</h3>
                <p className="text-text-tertiary mb-6 max-w-md">
                  将视频文件拖拽到此处，或点击选择文件开始上传
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  leftIcon={<Upload className="w-5 h-5" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUploadVideo();
                  }}
                >
                  选择视频文件
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px flex-1 bg-surface-border" />
              <span className="text-xs text-text-tertiary px-4">或者</span>
              <div className="h-px flex-1 bg-surface-border" />
            </div>

            <div className="mt-8 flex justify-center">
              <Button
                variant="secondary"
                size="lg"
                leftIcon={<Camera className="w-5 h-5" />}
                onClick={handleRecordVideo}
                className="gap-3"
              >
                使用摄像头录制
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">自动字幕生成中</h2>
            <p className="text-sm text-text-tertiary mb-8">
              系统正在识别语音内容并自动生成字幕，请稍候...
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative rounded-2xl overflow-hidden shadow-card bg-black aspect-video">
                <div className="absolute inset-0 bg-gradient-hero" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center border-2 border-white/40 animate-breathe">
                    <Video className="w-10 h-10 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-white text-sm font-medium text-center">预览视频内容...</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-accent flex items-center justify-center mb-4 shadow-button animate-pulse">
                    {generatingProgress < 100 ? (
                      <Loader2 className="w-10 h-10 text-white animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {generatingProgress < 100 ? '系统正在自动识别语音...' : '字幕生成完成！'}
                  </h3>
                  <p className="text-sm text-text-tertiary">
                    {generatingProgress < 100
                      ? `已完成 ${generatingProgress}%，预计还需 ${Math.ceil((100 - generatingProgress) / 10)} 秒`
                      : '识别到 5 段字幕，下一步可进行编辑'}
                  </p>
                </div>

                <ProgressBar
                  value={generatingProgress}
                  color="orange"
                  size="lg"
                  showPercentage
                  label="识别进度"
                />

                <div className="mt-8 space-y-3">
                  {[
                    { label: '语音识别', done: generatingProgress >= 30 },
                    { label: '语义分析', done: generatingProgress >= 60 },
                    { label: '时间轴对齐', done: generatingProgress >= 85 },
                    { label: '字幕生成', done: generatingProgress >= 100 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300',
                          item.done
                            ? 'bg-emerald-500 text-white scale-100'
                            : 'bg-surface-border text-surface-muted scale-90'
                        )}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-sm transition-colors',
                          item.done ? 'text-emerald-600 font-medium' : 'text-text-tertiary'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">编辑字幕</h2>
            <p className="text-sm text-text-tertiary mb-8">
              请检查并修改自动生成的字幕，确保内容准确无误
            </p>

            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2 space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {subtitles.map((sub, idx) => (
                  <div
                    key={sub.id}
                    className="flex items-start gap-3 p-4 rounded-xl bg-surface-bg/50 border border-surface-border/60 hover:border-primary-200 hover:shadow-sm transition-all duration-200 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex flex-col items-center gap-1 pt-2">
                      <span className="text-xs font-mono font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                        {sub.startTime}
                      </span>
                      <div className="w-0.5 h-2 bg-surface-border" />
                      <span className="text-xs font-mono font-bold text-text-tertiary bg-surface-bg px-2 py-1 rounded-md">
                        {sub.endTime}
                      </span>
                    </div>

                    <div className="flex-1">
                      <textarea
                        value={sub.text}
                        onChange={(e) => updateSubtitleText(sub.id, e.target.value)}
                        rows={2}
                        placeholder="输入字幕内容..."
                        className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all resize-none"
                      />
                    </div>

                    <button
                      onClick={() => removeSubtitle(sub.id)}
                      className="mt-2 w-9 h-9 rounded-lg flex items-center justify-center text-surface-muted hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addSubtitle}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-surface-border text-text-tertiary hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/30 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  添加新字幕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600" />
                    翻译文字说明
                  </h3>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={8}
                    maxLength={500}
                    placeholder="请输入视频的文字说明内容，这将帮助用户更好地理解你的视频..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-text-tertiary">{description.length}/500</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                  <p className="text-xs text-primary-700 leading-relaxed">
                    <strong>💡 小提示：</strong>
                    清晰的文字说明可以帮助更多人理解你的视频内容，也能获得更多推荐和互动哦~
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-surface-card rounded-2xl shadow-card border border-surface-border/60 p-8 animate-fade-in-up">
            <h2 className="text-lg font-bold text-text-primary mb-2">添加话题标签</h2>
            <p className="text-sm text-text-tertiary mb-8">
              添加相关话题可以让你的帖子被更多感兴趣的人看到
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-3">
                已选话题 <span className="text-text-tertiary">({selectedTopics.length}/10)</span>
              </label>
              <div className="min-h-[60px] p-4 rounded-xl border-2 border-dashed border-surface-border bg-surface-bg/30 flex flex-wrap gap-2">
                {selectedTopics.length === 0 ? (
                  <span className="text-sm text-text-tertiary self-center">
                    请从下方选择或输入话题标签...
                  </span>
                ) : (
                  selectedTopics.map((topic) => (
                    <TagChip
                      key={topic}
                      variant="primary"
                      size="md"
                      selected
                      removable
                      onRemove={() => toggleTopic(topic)}
                      className="animate-scale-in"
                    >
                      <Hash className="w-3.5 h-3.5" />
                      {topic}
                    </TagChip>
                  ))
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-text-secondary mb-3">自定义话题</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-muted" />
                  <input
                    type="text"
                    value={newTopicInput}
                    onChange={(e) => setNewTopicInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomTopic()}
                    placeholder="输入自定义话题名称..."
                    maxLength={20}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-surface-border bg-white text-sm text-text-primary placeholder:text-surface-muted focus:outline-none focus:border-primary-400 focus:ring-4 focus:ring-primary-50 transition-all"
                  />
                </div>
                <Button
                  variant="secondary"
                  onClick={addCustomTopic}
                  disabled={!newTopicInput.trim() || selectedTopics.length >= 10}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  添加
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-3">推荐话题</label>
              <div className="flex flex-wrap gap-2">
                {recommendedTopics.map((topic) => {
                  const isSelected = selectedTopics.includes(topic);
                  return (
                    <TagChip
                      key={topic}
                      variant={isSelected ? 'primary' : 'default'}
                      selected={isSelected}
                      size="md"
                      onClick={() => toggleTopic(topic)}
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      <Hash className="w-3.5 h-3.5" />
                      {topic}
                    </TagChip>
                  );
                })}
              </div>
            </div>

            {description && (
              <div className="mt-8 p-5 rounded-2xl bg-surface-bg/50 border border-surface-border/60">
                <h4 className="font-bold text-text-primary mb-2 text-sm">📝 发布预览</h4>
                <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{description}</p>
                {selectedTopics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedTopics.slice(0, 5).map((t) => (
                      <span key={t} className="text-xs text-primary-600 font-medium">
                        #{t}
                      </span>
                    ))}
                    {selectedTopics.length > 5 && (
                      <span className="text-xs text-text-tertiary">+{selectedTopics.length - 5}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-4 sticky bottom-6 z-20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <X className="w-4 h-4" />
              取消
            </Button>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrev}>
                <ArrowLeft className="w-4 h-4" />
                上一步
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={handleNext}
                disabled={currentStep === 1 && !videoUploaded}
              >
                下一步
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handlePublish}
                leftIcon={<CheckCircle2 className="w-5 h-5" />}
              >
                立即发布
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Languages,
  MessageCircle,
  ArrowLeft,
  Hand,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export default function NotFound() {
  const navigate = useNavigate();

  const quickNavs = [
    { icon: Home, label: '首页', path: '/', color: 'from-primary-500 to-primary-700', bg: 'bg-primary-50' },
    { icon: BookOpen, label: '课程', path: '/courses', color: 'from-accent-mint-400 to-accent-mint-600', bg: 'bg-accent-mint-50' },
    { icon: Languages, label: '词汇', path: '/vocabulary', color: 'from-accent-orange-400 to-accent-orange-600', bg: 'bg-accent-orange-50' },
    { icon: MessageCircle, label: '社区', path: '/community', color: 'from-purple-500 to-purple-700', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="relative mb-8 animate-fade-in">
          <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tight select-none">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-br from-primary-600 via-accent-mint-500 to-accent-orange-500"
              style={{
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease infinite',
              }}
            >
              404
            </span>
          </h1>
          <div className="absolute -top-4 -right-4 sm:-right-8 animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-elevation rotate-12">
              <Hand className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -left-2 sm:-left-4 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-mint flex items-center justify-center shadow-lg -rotate-6">
              <span className="text-2xl sm:text-3xl">🤟</span>
            </div>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-1">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            迷路了？
          </h2>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-accent-mint-50 flex items-center justify-center shrink-0">
              <Hand className="w-6 h-6 text-accent-mint-600" />
            </div>
            <p className="text-text-secondary text-base sm:text-lg text-left max-w-xs">
              别担心，用手语告诉我们你要去哪里，我们帮你找到方向！
            </p>
          </div>
        </div>

        <div className="animate-fade-in-up stagger-2 mb-10">
          <Button
            size="lg"
            leftIcon={<ArrowLeft className="w-5 h-5" />}
            onClick={() => navigate('/')}
            className="w-full sm:w-auto !px-10 !py-4 text-base shadow-button hover:shadow-button-hover"
          >
            返回首页
          </Button>
        </div>

        <div className="animate-fade-in-up stagger-3">
          <p className="text-sm text-text-tertiary mb-4">或者试试这些热门导航</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickNavs.map((item, idx) => (
              <Card
                key={idx}
                hoverable
                className="cursor-pointer group p-4"
                onClick={() => navigate(item.path)}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3',
                    item.bg
                  )}
                >
                  <item.icon
                    className={cn(
                      'w-6 h-6 bg-clip-text text-transparent bg-gradient-to-br',
                      item.color
                    )}
                    style={{ WebkitTextFillColor: 'transparent' }}
                  />
                </div>
                <p className="font-semibold text-text-primary text-sm group-hover:text-primary-600 transition-colors">
                  {item.label}
                </p>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12 animate-fade-in">
          <p className="text-xs text-text-tertiary flex items-center justify-center gap-1.5">
            <Hand className="w-3.5 h-3.5 text-accent-mint-500" />
            手语小提示：双手摊开表示"不知道"，用手指方向表示"去哪里"
          </p>
        </div>

        <style>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
        `}</style>
      </div>
    </div>
  );
}

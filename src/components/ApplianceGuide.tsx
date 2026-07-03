import React from 'react';
import { CleanIcon } from './CleanIcon';
import { Info, CheckCircle, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

export const ApplianceGuide: React.FC = () => {
  const guides = [
    {
      id: 'g-1',
      title: '드럼/통돌이 세탁기 세탁조 세척',
      appliance: '세탁기',
      icon: 'WashingMachine',
      cycle: '3개월 권장',
      importance: '상',
      tips: [
        '세탁기 내부에 먼지 및 유기물이 쌓이면 악취와 곰팡이의 원인이 됩니다.',
        '시중의 염소계 또는 산소계 세탁조 전용 클리너를 투입구에 넣습니다.',
        '‘통세척’ 코스를 작동하며, 해당 코스가 없는 경우 온수 설정 후 1시간 이상 불림 세탁을 가동하세요.',
        '세척 완료 후 반드시 세탁기 문과 세제통을 열어 자연 건조해야 유해 세균 번식을 막을 수 있습니다.',
        '하단 배수 필터 및 고무 패킹 틈새도 락스 희석액으로 수동 세척해 주는 것이 좋습니다.'
      ]
    },
    {
      id: 'g-2',
      title: '에어컨 극세필터 & 내부 송풍팬 케어',
      appliance: '에어컨',
      icon: 'Wind',
      cycle: '여름 시즌 시작 전 & 한 달에 1회 권장',
      importance: '상',
      tips: [
        '필터에 먼지가 쌓이면 냉방 효율이 급격히 떨어지고 전기요금이 과다 청구됩니다.',
        '안전하게 전원 플러그를 뽑은 뒤 에어컨 전면부 그릴을 들어 올립니다.',
        '극세필터(프리필터)를 조심스럽게 꺼내 샤워기를 이용하여 뒤에서 앞으로 먼지를 쓸어내듯 물세척합니다.',
        '기름때나 찌든 때가 있을 시 중성세제를 희석하여 부드러운 솔로 세척합니다.',
        '반드시 직사광선을 피해 그늘에서 100% 완벽히 건조하여 장착하세요. 덜 마른 필터는 퀴퀴한 냄새를 유발합니다.',
        '냉방 운전 가동 후 전원을 끄기 전 20~30분간 ‘송풍’ 또는 ‘자동 건조’ 기능을 켜서 내부 열교환기의 수분을 말려줍니다.'
      ]
    },
    {
      id: 'g-3',
      title: '공기청정기 프리필터 & 헤파필터 점검',
      appliance: '공기청정기',
      icon: 'Fan',
      cycle: '프리필터 2주 / 헤파(집진)필터 6~12개월 권장',
      importance: '상',
      tips: [
        '공기청정기는 상시 가동되는 만큼 필터 관리가 필터식 청정 기능의 90%를 결정합니다.',
        '겉면에 부착된 극세사 프리필터는 물세척이 가능하며 약 2주에 한 번 청소기 흡입 혹은 샤워기 세척을 진행합니다.',
        '내부의 헤파(HEPA) 집진필터 및 탈취필터는 절대 물에 닿아서는 안 됩니다 (청정성능 즉시 상실).',
        '헤파필터는 약 6~12개월마다 새 정품 필터로 교체하여 교체 주기를 리셋해 줍니다.',
        '본체 먼지 센서 렌즈 부위도 면봉에 물을 묻혀 주기적으로 닦아 주어야 먼지 수치를 정확히 측정합니다.'
      ]
    },
    {
      id: 'g-4',
      title: '냉장고 유통기한 정리 및 에탄올 탈취',
      appliance: '냉장고',
      icon: 'Refrigerator',
      cycle: '2개월 권장',
      importance: '중',
      tips: [
        '냉장고의 냉기도 수분 순환에 의해 세균이 생기기 좋은 환경입니다.',
        '유통기한이 지난 소스나 오래 방치된 반찬용기를 과감히 배출합니다.',
        '선반을 탈거할 수 있으면 주방세제로 씻은 뒤 건조합니다.',
        '내부 벽면과 선반 조립 틈새는 소주 혹은 소독용 에탄올을 분무하여 행주로 말끔히 닦아내면 악취와 유해균이 사멸합니다.',
        '커피 찌꺼기나 베이킹소다를 담아 냉장고 구석에 두면 천연 탈취제 역할을 합니다.'
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 가이드 헤더 */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400" size={22} />
          정기 가전 케어 살림 가이드
        </h2>
        <p className="text-xs text-white/60 mt-1">
          집안 가전제품의 위생을 100% 지키고 수명을 연장하기 위한 전문가 수준의 청소 및 필터 교체 가이드를 읽어보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guides.map((g) => (
          <div key={g.id} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-4 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                  <CleanIcon name={g.icon} size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm md:text-base">{g.title}</h3>
                  <span className="text-[10px] bg-white/10 border border-white/5 text-white/85 px-2 py-0.5 rounded font-semibold">
                    대상 가전: {g.appliance}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs bg-amber-500/25 border border-amber-500/25 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                  {g.cycle}
                </span>
              </div>
            </div>

            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 flex gap-2 items-start text-xs text-amber-200 leading-relaxed">
              <Info size={14} className="mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-amber-300">안전 최우선!</span> 청소 시작 전 반드시 전자제품의 전원 플러그를 뽑거나 차단기를 내리고 안전하게 장갑을 착용한 뒤 실행하세요.
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-white/80 flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-400" />
                상세 케어 요령:
              </p>
              <ul className="space-y-1.5 pl-4 list-decimal text-xs text-white/70 leading-relaxed">
                {g.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 오디오 관리 클래스
class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterVolume = 0.5;
    }

    // 무서운 브금 생성 (저주받은 분위기)
    playScaryMusic() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 4;

        // 베이스 음
        const bass = ctx.createOscillator();
        bass.frequency.value = 55; // 낮은 음
        bass.type = 'sine';

        const bassGain = ctx.createGain();
        bassGain.gain.setValueAtTime(0.1, now);
        bassGain.gain.linearRampToValueAtTime(0.2, now + duration);

        bass.connect(bassGain);
        bassGain.connect(ctx.destination);
        bass.start(now);
        bass.stop(now + duration);

        // 으스스한 고음
        const eerie = ctx.createOscillator();
        eerie.frequency.value = 220;
        eerie.type = 'triangle';

        const eerieGain = ctx.createGain();
        eerieGain.gain.setValueAtTime(0.05, now);
        eerieGain.gain.linearRampToValueAtTime(0.15, now + duration);

        eerie.connect(eerieGain);
        eerieGain.connect(ctx.destination);
        eerie.start(now);
        eerie.stop(now + duration);
    }

    // 귀신 갑툭튀 소리 (무서운 비명 효과)
    playGhostAppear() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 0.5;

        // 급격한 음 상승
        const ghost = ctx.createOscillator();
        ghost.frequency.setValueAtTime(100, now);
        ghost.frequency.exponentialRampToValueAtTime(800, now + duration);
        ghost.type = 'square';

        const ghostGain = ctx.createGain();
        ghostGain.gain.setValueAtTime(0.3, now);
        ghostGain.gain.exponentialRampToValueAtTime(0.05, now + duration);

        ghost.connect(ghostGain);
        ghostGain.connect(ctx.destination);
        ghost.start(now);
        ghost.stop(now + duration);
    }

    // 문 열리는 소리
    playDoorOpen() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 0.8;

        // 크리이이익 소리
        const door = ctx.createOscillator();
        door.frequency.setValueAtTime(200, now);
        door.frequency.linearRampToValueAtTime(150, now + duration);
        door.type = 'sine';

        const doorGain = ctx.createGain();
        doorGain.gain.setValueAtTime(0.2, now);
        doorGain.gain.linearRampToValueAtTime(0.05, now + duration);

        door.connect(doorGain);
        doorGain.connect(ctx.destination);
        door.start(now);
        door.stop(now + duration);

        // 노이즈 추가
        const noise = ctx.createBufferSource();
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            noiseData[i] = Math.random() * 2 - 1;
        }
        noise.buffer = noiseBuffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.linearRampToValueAtTime(0.02, now + duration);

        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    }

    // 열쇠 획득 소리
    playKeyPickup() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // 첫 번째 음
        const key1 = ctx.createOscillator();
        key1.frequency.value = 800;
        key1.type = 'sine';

        const key1Gain = ctx.createGain();
        key1Gain.gain.setValueAtTime(0.15, now);
        key1Gain.gain.exponentialRampToValueAtTime(0.02, now + 0.15);

        key1.connect(key1Gain);
        key1Gain.connect(ctx.destination);
        key1.start(now);
        key1.stop(now + 0.15);

        // 두 번째 음 (더 높음)
        const key2 = ctx.createOscillator();
        key2.frequency.value = 1200;
        key2.type = 'sine';

        const key2Gain = ctx.createGain();
        key2Gain.gain.setValueAtTime(0.15, now + 0.1);
        key2Gain.gain.exponentialRampToValueAtTime(0.02, now + 0.25);

        key2.connect(key2Gain);
        key2Gain.connect(ctx.destination);
        key2.start(now + 0.1);
        key2.stop(now + 0.25);
    }

    // 발 소리 (누군가 다가오는 소리)
    playFootstep() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 0.3;

        // 저주파 부딪히는 소리
        const step = ctx.createOscillator();
        step.frequency.setValueAtTime(150, now);
        step.frequency.linearRampToValueAtTime(100, now + duration);
        step.type = 'sine';

        const stepGain = ctx.createGain();
        stepGain.gain.setValueAtTime(0.2, now);
        stepGain.gain.linearRampToValueAtTime(0.05, now + duration);

        step.connect(stepGain);
        stepGain.connect(ctx.destination);
        step.start(now);
        step.stop(now + duration);

        // 노이즈 추가
        const noise = ctx.createBufferSource();
        const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
            noiseData[i] = Math.random() * 2 - 1;
        }
        noise.buffer = noiseBuffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.linearRampToValueAtTime(0.02, now + duration);

        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    }

    // 플레이어 피격 소리
    playPlayerHit() {
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const duration = 0.4;

        // 아픈 비명
        const hit = ctx.createOscillator();
        hit.frequency.setValueAtTime(400, now);
        hit.frequency.exponentialRampToValueAtTime(200, now + duration);
        hit.type = 'sine';

        const hitGain = ctx.createGain();
        hitGain.gain.setValueAtTime(0.25, now);
        hitGain.gain.exponentialRampToValueAtTime(0.05, now + duration);

        hit.connect(hitGain);
        hitGain.connect(ctx.destination);
        hit.start(now);
        hit.stop(now + duration);
    }

    // 배경 음악 루프 (으스스한 분위기)
    playBackgroundAmbience() {
        if (this.ambienceInterval) clearInterval(this.ambienceInterval);
        
        this.ambienceInterval = setInterval(() => {
            const ctx = this.audioContext;
            const now = ctx.currentTime;
            
            // 랜덤한 으스스한 소리
            if (Math.random() > 0.7) {
                const ambient = ctx.createOscillator();
                ambient.frequency.value = Math.random() * 100 + 50;
                ambient.type = 'sine';

                const ambientGain = ctx.createGain();
                ambientGain.gain.setValueAtTime(0.02, now);
                ambientGain.gain.linearRampToValueAtTime(0.01, now + 1);

                ambient.connect(ambientGain);
                ambientGain.connect(ctx.destination);
                ambient.start(now);
                ambient.stop(now + 1);
            }
        }, 2000);
    }

    stopBackgroundAmbience() {
        if (this.ambienceInterval) {
            clearInterval(this.ambienceInterval);
        }
    }
}

const audioManager = new AudioManager();
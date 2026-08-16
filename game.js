// 게임 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 상태
const gameState = {
    running: true,
    player: {
        x: 100,
        y: 100,
        width: 30,
        height: 30,
        speed: 3,
        keys: 0,
        health: 100
    },
    ghost: {
        x: 600,
        y: 500,
        width: 40,
        height: 40,
        speed: 2,
        targetPlayer: false,
        direction: 0
    },
    door: {
        x: 700,
        y: 250,
        width: 60,
        height: 100,
        locked: true,
        isOpen: false
    },
    key: {
        x: 400,
        y: 300,
        width: 20,
        height: 20,
        collected: false
    },
    walls: [
        { x: 0, y: 0, width: 800, height: 20 }, // 위
        { x: 0, y: 580, width: 800, height: 20 }, // 아래
        { x: 0, y: 0, width: 20, height: 600 }, // 왼쪽
        { x: 780, y: 0, width: 20, height: 600 }, // 오른쪽
        { x: 200, y: 150, width: 300, height: 20 }, // 중간 벽
    ],
    lastFootstepTime: 0,
    lastScaryMusicTime: 0
};

// 입력 처리
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (e.key === 'Escape') {
        gameState.running = false;
        document.getElementById('gameOverScreen').classList.add('show');
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// 충돌 감지
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 거리 계산
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// 플레이어 업데이트
function updatePlayer() {
    const { player, walls } = gameState;
    
    let newX = player.x;
    let newY = player.y;

    // 이동
    if (keys['w']) newY -= player.speed;
    if (keys['s']) newY += player.speed;
    if (keys['a']) newX -= player.speed;
    if (keys['d']) newX += player.speed;

    // 벽 충돌 검사
    const potentialRect = { 
        x: newX, 
        y: newY, 
        width: player.width, 
        height: player.height 
    };

    let collision = false;
    for (let wall of walls) {
        if (checkCollision(potentialRect, wall)) {
            collision = true;
            break;
        }
    }

    if (!collision) {
        player.x = newX;
        player.y = newY;
    }

    // 열쇠 수집
    if (!gameState.key.collected && checkCollision(player, gameState.key)) {
        gameState.key.collected = true;
        gameState.player.keys = 1;
        gameState.door.locked = false;
        document.getElementById('keys').textContent = '1';
        audioManager.playKeyPickup();
        document.getElementById('status').textContent = '열쇠를 얻었습니다!';
    }

    // 문으로 탈출
    if (gameState.player.keys === 1 && !gameState.door.isOpen && checkCollision(player, gameState.door)) {
        gameState.door.isOpen = true;
        audioManager.playDoorOpen();
        gameState.running = false;
        document.getElementById('winScreen').classList.add('show');
    }

    // 귀신에게 잡혔는가?
    if (checkCollision(player, gameState.ghost)) {
        gameState.player.health = 0;
        gameState.running = false;
        audioManager.playPlayerHit();
        document.getElementById('gameOverScreen').classList.add('show');
    }

    // UI 업데이트
    document.getElementById('health').textContent = gameState.player.health;
    document.getElementById('position').textContent = `${Math.floor(player.x)}, ${Math.floor(player.y)}`;
}

// 귀신 AI 업데이트
function updateGhost() {
    const { ghost, player } = gameState;
    const distance = getDistance(ghost.x, ghost.y, player.x, player.y);

    // 플레이어가 가까우면 추격
    if (distance < 300) {
        ghost.targetPlayer = true;
        audioManager.playScaryMusic();
        
        // 플레이어 방향으로 이동
        const angle = Math.atan2(player.y - ghost.y, player.x - ghost.x);
        ghost.x += Math.cos(angle) * ghost.speed;
        ghost.y += Math.sin(angle) * ghost.speed;

        // 발소리 주기적 재생
        const now = Date.now();
        if (now - gameState.lastFootstepTime > 400) {
            audioManager.playFootstep();
            gameState.lastFootstepTime = now;
        }

        // 으스스한 음악 주기적 재생
        if (now - gameState.lastScaryMusicTime > 3000) {
            audioManager.playScaryMusic();
            gameState.lastScaryMusicTime = now;
        }

        document.getElementById('status').textContent = '⚠️ 귀신이 다가온다!';
    } else {
        ghost.targetPlayer = false;
        // 랜덤 움직임
        if (Math.random() > 0.98) {
            ghost.direction = Math.random() * Math.PI * 2;
        }
        ghost.x += Math.cos(ghost.direction) * (ghost.speed * 0.5);
        ghost.y += Math.sin(ghost.direction) * (ghost.speed * 0.5);
        
        if (distance < 400) {
            document.getElementById('status').textContent = '주변이 으스스합니다...';
        } else {
            document.getElementById('status').textContent = '안전합니다';
        }
    }

    // 경계 충돌
    const { walls } = gameState;
    const ghostRect = { x: ghost.x, y: ghost.y, width: ghost.width, height: ghost.height };
    
    for (let wall of walls) {
        if (checkCollision(ghostRect, wall)) {
            ghost.direction = Math.random() * Math.PI * 2;
            ghost.x -= Math.cos(ghost.direction) * ghost.speed;
            ghost.y -= Math.sin(ghost.direction) * ghost.speed;
        }
    }

    // 귀신과 플레이어 충돌
    if (checkCollision({ x: ghost.x, y: ghost.y, width: ghost.width, height: ghost.height }, 
                       { x: player.x, y: player.y, width: player.width, height: player.height })) {
        audioManager.playGhostAppear();
        gameState.player.health -= 50;
        if (gameState.player.health <= 0) {
            gameState.running = false;
            document.getElementById('gameOverScreen').classList.add('show');
        }
    }
}

// 그리기
function draw() {
    // 배경
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 벽 그리기
    ctx.fillStyle = '#444';
    for (let wall of gameState.walls) {
        ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    }

    // 플레이어 그리기
    const { player } = gameState;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.strokeStyle = '#00aa00';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);

    // 귀신 그리기
    const { ghost } = gameState;
    ctx.fillStyle = ghost.targetPlayer ? '#ff3333' : '#8844ff';
    ctx.globalAlpha = ghost.targetPlayer ? 0.9 : 0.6;
    
    // 귀신 몸체
    ctx.beginPath();
    ctx.arc(ghost.x + ghost.width / 2, ghost.y + ghost.height / 2, ghost.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // 귀신 눈
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ghost.x + ghost.width / 2 - 5, ghost.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ghost.x + ghost.width / 2 + 5, ghost.y + 10, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // 귀신 입
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ghost.x + ghost.width / 2, ghost.y + 20, 3, 0, Math.PI);
    ctx.stroke();
    
    ctx.globalAlpha = 1;

    // 열쇠 그리기
    if (!gameState.key.collected) {
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(gameState.key.x, gameState.key.y, gameState.key.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // 문 그리기
    const { door } = gameState;
    ctx.fillStyle = door.locked ? '#8B4513' : '#90EE90';
    ctx.fillRect(door.x, door.y, door.width, door.height);
    
    // 문 테두리
    ctx.strokeStyle = door.isOpen ? '#00ff00' : '#ff0000';
    ctx.lineWidth = 3;
    ctx.strokeRect(door.x, door.y, door.width, door.height);
    
    // 문 텍스트
    ctx.fillStyle = door.isOpen ? '#00ff00' : '#ff0000';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(door.isOpen ? '탈출!' : door.locked ? '잠금' : '열기', door.x + door.width / 2, door.y + door.height / 2);
}

// 게임 루프
function gameLoop() {
    if (gameState.running) {
        updatePlayer();
        updateGhost();
    }
    
    draw();
    requestAnimationFrame(gameLoop);
}

// 게임 시작
document.getElementById('status').textContent = '게임 시작!';
audioManager.playBackgroundAmbience();
gameLoop();
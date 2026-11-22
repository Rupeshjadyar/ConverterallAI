import { Component, signal, computed, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
type PieceColor = 'w' | 'b';

interface ChessPiece { type: PieceType; color: PieceColor; }
interface Move {
  from: [number, number]; to: [number, number];
  piece: ChessPiece; captured?: ChessPiece | null;
  notation?: string; isCastle?: boolean; isEnPassant?: boolean; promotion?: PieceType;
}

@Component({
  selector: 'app-chess',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.css']
})
export class ChessComponent implements OnInit {
  private title = inject(Title);
  private meta = inject(Meta);
  private pid = inject(PLATFORM_ID);

  board: (ChessPiece | null)[][] = [];
  turn = signal<PieceColor>('w');
  selectedSquare = signal<[number, number] | null>(null);
  legalMoves = signal<[number, number][]>([]);
  moveHistory = signal<Move[]>([]);
  isGameOver = signal<boolean>(false);
  gameWinner = signal<PieceColor | 'draw' | null>(null);
  inCheck = signal<boolean>(false);
  gameOverReason = signal('');

  gameMode = signal<'ai' | '2p'>('ai');
  aiDifficulty = signal<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  isFlipped = signal<boolean>(false);

  // Promotion modal ke liye
  pendingPromo = signal<{from:[number,number]; to:[number,number]}|null>(null);
  promoOptions: PieceType[] = ['q','r','b','n'];

  capturedByWhite = signal<ChessPiece[]>([]);
  capturedByBlack = signal<ChessPiece[]>([]);

  // --- Private rule state ---
  private castling = { wK:true, wQ:true, bK:true, bQ:true };
  private enPassant: [number,number]|null = null;
  private halfmove = 0;
  private positions = new Map<string,number>();

  displayRows = computed(() => this.isFlipped() ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7]);
  displayCols = computed(() => this.isFlipped() ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7]);
  materialDiff = computed(() => {
    const v: Record<PieceType,number> = {p:1,n:3,b:3,r:5,q:9,k:0};
    let s=0; this.board.flat().forEach(p=>{ if(p) s+= p.color==='w'?v[p.type]:-v[p.type]; });
    return s;
  });
  evalText = computed(()=>{ const d=this.materialDiff(); return d===0?'Equal':d>0?`White +${d}`:`Black +${-d}`; });

  ngOnInit() {
    this.title.setTitle('Play Chess Online Free vs Computer | Chess Master — No Signup');
    this.meta.addTags([
      {name:'description',content:'Play Chess online free vs Computer AI (Easy to Expert) or 2 Players. No signup, no download. Castling, En Passant, Promotion, Checkmate — full 【entity-FIDE¦canonical_name=FIDE】 rules.'},
      {name:'keywords',content:'play chess online, free chess game, chess vs computer, chess master, chess 2 player, online chess'},
      {property:'og:title',content:'Chess Master — Play Chess Online Free'},
      {property:'og:description',content:'Full-rules chess vs AI or 2 Players. Instant play, no signup.'},
      {property:'og:type',content:'website'},
      {name:'robots',content:'index, follow'}
    ]);
    if(isPlatformBrowser(this.pid)){
      const s=document.createElement('script'); s.type='application/ld+json';
      s.text=JSON.stringify({"@context":"https://schema.org","@type":"VideoGame","name":"Chess Master","applicationCategory":"Game","operatingSystem":"Web","genre":"Board Game","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Play chess online free vs computer AI or 2 players with full 【entity-FIDE¦canonical_name=FIDE】 rules."});
      document.head.appendChild(s);
    }
    this.resetGame();
  }

  setMode(mode: 'ai' | '2p') { this.gameMode.set(mode); this.resetGame(); }
  flipBoard() { this.isFlipped.set(!this.isFlipped()); }

  resetGame() {
    this.board = this.createInitialBoard();
    this.turn.set('w'); this.selectedSquare.set(null); this.legalMoves.set([]);
    this.moveHistory.set([]); this.isGameOver.set(false); this.gameWinner.set(null);
    this.inCheck.set(false); this.capturedByWhite.set([]); this.capturedByBlack.set([]);
    this.castling={wK:true,wQ:true,bK:true,bQ:true}; this.enPassant=null; this.halfmove=0;
    this.positions.clear(); this.pendingPromo.set(null); this.gameOverReason.set('');
    this.recordPos();
  }

  createInitialBoard(): (ChessPiece | null)[][] {
    const b: (ChessPiece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRow: PieceType[] = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = { type: backRow[c], color: 'b' };
      b[1][c] = { type: 'p', color: 'b' };
      b[6][c] = { type: 'p', color: 'w' };
      b[7][c] = { type: backRow[c], color: 'w' };
    }
    return b;
  }

  // ---------- UNDO / RESIGN / PGN ----------
  canUndo(){ return this.moveHistory().length>0 && !this.pendingPromo(); }
  undo(){
    if(!this.canUndo()) return;
    const steps = this.gameMode()==='ai'?2:1;
    const keep = this.moveHistory().slice(0, Math.max(0, this.moveHistory().length-steps));
    const mode=this.gameMode(); this.resetGame(); this.gameMode.set(mode);
    for(const m of keep) this.makeMove(m.from[0],m.from[1],m.to[0],m.to[1],m.promotion);
    this.selectedSquare.set(null); this.legalMoves.set([]); this.pendingPromo.set(null);
  }
  resign(){ if(this.isGameOver()) return; this.isGameOver.set(true); this.gameWinner.set(this.turn()==='w'?'b':'w'); this.gameOverReason.set('Resigned'); }
  copyPGN(){ const pgn=this.moveHistory().map((m,i)=>(i%2===0?`${Math.floor(i/2)+1}. `:'')+m.notation).join(' '); if(isPlatformBrowser(this.pid)) navigator.clipboard?.writeText(pgn).catch(()=>{}); }

  // ---------- CLICK ----------
  onSquareClick(r: number, c: number) {
    if (this.isGameOver() || this.pendingPromo()) return;
    if (this.gameMode() === 'ai' && this.turn() === 'b') return;
    const selected = this.selectedSquare();
    if (selected && this.isLegalMove(r, c)) {
      const pc = this.board[selected[0]][selected[1]]!;
      if(pc.type==='p' && (r===0||r===7)){ this.pendingPromo.set({from:selected,to:[r,c]}); return; }
      this.doMove(selected[0], selected[1], r, c);
      return;
    }
    const piece = this.board[r][c];
    if (piece && piece.color === this.turn()) {
      this.selectedSquare.set([r, c]);
      this.legalMoves.set(this.getPieceLegalMoves(r, c, this.board));
    } else { this.selectedSquare.set(null); this.legalMoves.set([]); }
  }
  doMove(fr:number,fc:number,tr:number,tc:number,promo?:PieceType){
    this.makeMove(fr,fc,tr,tc,promo);
    this.selectedSquare.set(null); this.legalMoves.set([]);
    if (!this.isGameOver() && this.gameMode() === 'ai' && this.turn() === 'b') setTimeout(() => this.makeAIMove(), 350);
  }
  confirmPromo(t:PieceType){
    const p=this.pendingPromo(); if(!p) return; this.pendingPromo.set(null);
    this.doMove(p.from[0],p.from[1],p.to[0],p.to[1],t);
  }
  promoSymbol(t:PieceType){ return this.getPieceSymbol({type:t,color:this.turn()}); }
  isLegalMove(r: number, c: number): boolean { return this.legalMoves().some(([lr, lc]) => lr === r && lc === c); }

  // ---------- CORE MOVE ----------
  makeMove(fromR: number, fromC: number, toR: number, toC: number, promo?: PieceType) {
    const piece = this.board[fromR][fromC]!;
    const isEP = !!this.enPassant && toR===this.enPassant[0] && toC===this.enPassant[1] && piece.type==='p' && !this.board[toR][toC];
    let captured = this.board[toR][toC];
    if(isEP){ captured=this.board[fromR][toC]; this.board[fromR][toC]=null; }
    if (captured) {
      if (piece.color === 'w') this.capturedByWhite.update(arr => [...arr, captured!]);
      else this.capturedByBlack.update(arr => [...arr, captured!]);
    }
    const isCastle = piece.type==='k' && Math.abs(toC-fromC)===2;
    if(isCastle){ const row=fromR; const qs=toC===2; const rf=qs?0:7, rt=qs?3:5; this.board[row][rt]=this.board[row][rf]; this.board[row][rf]=null; }

    this.board[toR][toC] = piece; this.board[fromR][fromC] = null;
    const finalPromo: PieceType|undefined = piece.type==='p' && (toR===0||toR===7) ? (promo||'q') : undefined;
    if(finalPromo) piece.type=finalPromo;

    const notation = this.generateNotation(piece, fromR, fromC, toR, toC, captured != null, isCastle, isEP, finalPromo);
    const move: Move = { from: [fromR, fromC], to: [toR, toC], piece: { ...piece }, captured, notation, isCastle, isEnPassant:isEP, promotion:finalPromo };
    this.moveHistory.update(arr => [...arr, move]);

    this.enPassant = (piece.type==='p' && Math.abs(toR-fromR)===2) ? [(fromR+toR)/2, fromC] : null;
    if(piece.type==='k'){ if(piece.color==='w'){this.castling.wK=false;this.castling.wQ=false;} else {this.castling.bK=false;this.castling.bQ=false;} }
    if(piece.type==='r'){ if(fromR===7&&fromC===0)this.castling.wQ=false; if(fromR===7&&fromC===7)this.castling.wK=false; if(fromR===0&&fromC===0)this.castling.bQ=false; if(fromR===0&&fromC===7)this.castling.bK=false; }
    if(captured?.type==='r'){ if(toR===7&&toC===0)this.castling.wQ=false; if(toR===7&&toC===7)this.castling.wK=false; if(toR===0&&toC===0)this.castling.bQ=false; if(toR===0&&toC===7)this.castling.bK=false; }
    this.halfmove = (piece.type==='p'||captured)?0:this.halfmove+1;

    const nextTurn = this.turn() === 'w' ? 'b' : 'w';
    this.turn.set(nextTurn);
    this.recordPos();

    const inCheck = this.isKingInCheck(nextTurn, this.board);
    this.inCheck.set(inCheck);
    const hasMoves = this.hasAnyLegalMoves(nextTurn, this.board);
    if (!hasMoves) {
      this.isGameOver.set(true);
      if (inCheck){ this.gameWinner.set(piece.color); this.gameOverReason.set('Checkmate'); }
      else { this.gameWinner.set('draw'); this.gameOverReason.set('Stalemate — koi legal move nahi'); }
    } else if(this.halfmove>=100){ this.isGameOver.set(true); this.gameWinner.set('draw'); this.gameOverReason.set('Draw by 50-move rule'); }
    else if((this.positions.get(this.fenKey())||0)>=3){ this.isGameOver.set(true); this.gameWinner.set('draw'); this.gameOverReason.set('Draw by Threefold Repetition'); }
    else if(this.insufficient()){ this.isGameOver.set(true); this.gameWinner.set('draw'); this.gameOverReason.set('Draw — Insufficient Material'); }
  }

  private fenKey(){ return this.board.map(r=>r.map(p=>p?p.color+p.type:'..').join('')).join('/')+this.turn()+JSON.stringify(this.enPassant)+JSON.stringify(this.castling); }
  private recordPos(){ const k=this.fenKey(); this.positions.set(k,(this.positions.get(k)||0)+1); }
  private insufficient(){
    const ps=this.board.flat().filter(Boolean) as ChessPiece[];
    if(ps.length===2) return true;
    if(ps.length===3 && ps.some(p=>p.type==='n'||p.type==='b')) return true;
    return false;
  }

  // ---------- AI - Minimax + PST ----------
  makeAIMove() {
    if (this.isGameOver() || this.turn() !== 'b') return;
    const depth = this.aiDifficulty()==='easy'?1:this.aiDifficulty()==='medium'?2:this.aiDifficulty()==='hard'?3:4;
    const mv = this.bestMove(depth); if(!mv) return;
    this.makeMove(mv.from[0],mv.from[1],mv.to[0],mv.to[1],mv.promotion);
  }
  bestMove(depth:number){
    let bestScore=-Infinity; let best:any=null;
    for(const mv of this.allLegal('b')){
      const nb=this.board.map(r=>[...r]); nb[mv.to[0]][mv.to[1]]=nb[mv.from[0]][mv.from[1]]; nb[mv.from[0]][mv.from[1]]=null;
      const sc=this.minimax(nb,depth-1,-Infinity,Infinity,false);
      if(sc>bestScore){ bestScore=sc; best=mv; }
    }
    if(!best) return null;
    const pc=this.board[best.from[0]][best.from[1]]!;
    return { ...best, promotion: pc.type==='p'&&best.to[0]===7?'q' as PieceType:undefined };
  }
  allLegal(color:PieceColor){
    const out:{from:[number,number];to:[number,number]}[]=[];
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=this.board[r][c]; if(p?.color===color) for(const to of this.getPieceLegalMoves(r,c,this.board)) out.push({from:[r,c],to}); }
    return out;
  }
  evaluate(b:(ChessPiece|null)[][]):number{
    const v:Record<PieceType,number>={p:100,n:320,b:330,r:500,q:900,k:20000};
    const pst:Record<PieceType,number[][]>={
      p:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
      n:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
      b:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
      r:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,5,5,0,0,0]],
      q:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
      k:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
    };
    let s=0; for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(p){ const val=v[p.type]+(p.color==='w'?pst[p.type][r][c]:pst[p.type][7-r][c]); s+=p.color==='w'?val:-val; } }
    return -s;
  }
  minimax(b:(ChessPiece|null)[][],depth:number,alpha:number,beta:number,max:boolean):number{
    if(depth===0) return this.evaluate(b);
    const color:PieceColor=max?'b':'w';
    let best=max?-Infinity:Infinity; let moved=false;
    for(let r=0;r<8;r++) for(let c=0;c<8;c++){ const p=b[r][c]; if(p?.color!==color) continue;
      const savedEP=this.enPassant; this.enPassant=null;
      for(const to of this.getRawMoves(r,c,p,b)){
        const nb=b.map(row=>[...row]); nb[to[0]][to[1]]=p; nb[r][c]=null;
        if(this.isKingInCheck(color,nb)) continue; moved=true;
        const sc=this.minimax(nb,depth-1,alpha,beta,!max);
        if(max){ best=Math.max(best,sc); alpha=Math.max(alpha,sc);} else { best=Math.min(best,sc); beta=Math.min(beta,sc);}
        if(beta<=alpha){ this.enPassant=savedEP; return best; }
      }
      this.enPassant=savedEP;
    }
    return moved?best:this.evaluate(b);
  }

  // ---------- MOVES / CHECK ----------
  getPieceLegalMoves(r: number, c: number, b: (ChessPiece | null)[][]): [number, number][] {
    const piece = b[r][c]; if (!piece) return [];
    const rawMoves = this.getRawMoves(r, c, piece, b);
    return rawMoves.filter(([tr, tc]) => {
      const tempBoard = b.map(row => [...row]);
      tempBoard[tr][tc] = piece; tempBoard[r][c] = null;
      if(piece.type==='p'&&this.enPassant&&tr===this.enPassant[0]&&tc===this.enPassant[1]) tempBoard[r][tc]=null;
      return !this.isKingInCheck(piece.color, tempBoard);
    });
  }
  getRawMoves(r: number, c: number, piece: ChessPiece, b: (ChessPiece | null)[][]): [number, number][] {
    const moves: [number, number][] = [];
    const color = piece.color; const enemy = color === 'w' ? 'b' : 'w';
    const addIfValid = (nr: number, nc: number): boolean => {
      if (nr < 0 || nr >= 8 || nc < 0 || nc >= 8) return false;
      const target = b[nr][nc];
      if (!target) { moves.push([nr, nc]); return true; }
      if (target.color === enemy) moves.push([nr, nc]);
      return false;
    };
    if (piece.type === 'p') {
      const dir = color === 'w' ? -1 : 1; const startRow = color === 'w' ? 6 : 1;
      if (r + dir >= 0 && r + dir < 8 && !b[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && !b[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
      }
      for (const dc of [-1, 1]) {
        const tr = r + dir; const tc = c + dc;
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          const t = b[tr][tc];
          if (t && t.color === enemy) moves.push([tr, tc]);
          else if(this.enPassant && tr===this.enPassant[0] && tc===this.enPassant[1]) moves.push([tr,tc]);
        }
      }
    } else if (piece.type === 'n') {
      const off = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of off) addIfValid(r + dr, c + dc);
    } else if (piece.type === 'k') {
      const dirs = [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) addIfValid(r + dr, c + dc);
      // CASTLING
      const row = color==='w'?7:0; const canK=color==='w'?this.castling.wK:this.castling.bK; const canQ=color==='w'?this.castling.wQ:this.castling.bQ;
      if(r===row && c===4 && !this.isKingInCheck(color,b)){
        if(canK && !b[row][5] && !b[row][6] && b[row][7]?.type==='r' && !this.isSquareAttacked(row,5,enemy,b) && !this.isSquareAttacked(row,6,enemy,b)) moves.push([row,6]);
        if(canQ && !b[row][3] && !b[row][2] && !b[row][1] && b[row][0]?.type==='r' && !this.isSquareAttacked(row,3,enemy,b) && !this.isSquareAttacked(row,2,enemy,b)) moves.push([row,2]);
      }
    } else {
      const dirs = piece.type==='b' ? [[-1,-1],[-1,1],[1,-1],[1,1]] : piece.type==='r' ? [[-1,0],[1,0],[0,-1],[0,1]] : [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]];
      for (const [dr, dc] of dirs) { let step = 1; while (addIfValid(r + dr * step, c + dc * step)) step++; }
    }
    return moves;
  }
  isSquareAttacked(r:number,c:number,by:PieceColor,b:(ChessPiece|null)[][]):boolean{
    for(let i=0;i<8;i++) for(let j=0;j<8;j++){ const p=b[i][j]; if(!p||p.color!==by) continue;
      if(p.type==='p'){ const d=by==='w'?-1:1; if(i+d===r && Math.abs(j-c)===1) return true; }
      else if(p.type==='k'){ if(Math.abs(i-r)<=1 && Math.abs(j-c)<=1) return true; }
      else if(this.getRawMoves(i,j,p,b).some(([x,y])=>x===r&&y===c)) return true;
    }
    return false;
  }
  isKingInCheck(color: PieceColor, b: (ChessPiece | null)[][]): boolean {
    let kr=-1,kc=-1;
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const p = b[r][c]; if (p && p.type === 'k' && p.color === color) { kr=r; kc=c; } }
    if (kr===-1) return false;
    return this.isSquareAttacked(kr,kc,color==='w'?'b':'w',b);
  }
  hasAnyLegalMoves(color: PieceColor, b: (ChessPiece | null)[][]): boolean {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const p = b[r][c]; if (p && p.color === color) { if (this.getPieceLegalMoves(r, c, b).length > 0) return true; } }
    return false;
  }

  // ---------- UI ----------
  getPieceSymbol(piece: ChessPiece): string {
    const symbols: Record<PieceColor, Record<PieceType, string>> = {
      w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
      b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
    };
    return symbols[piece.color][piece.type];
  }
  getFileLabel(col: number): string { return String.fromCharCode(97 + col); }
  getSquareClass(r: number, c: number): string {
    const isDark = (r + c) % 2 === 1;
    let cls = isDark ? 'sq-dark' : 'sq-light';
    const sel = this.selectedSquare();
    if (sel && sel[0] === r && sel[1] === c) cls += ' sq-selected';
    const p = this.board[r][c];
    if (p && p.type === 'k' && p.color === this.turn() && this.inCheck()) cls += ' sq-check';
    const last = this.moveHistory().slice(-1)[0];
    if (last && ((last.from[0] === r && last.from[1] === c) || (last.to[0] === r && last.to[1] === c))) cls += ' sq-last-move';
    return cls;
  }
  generateNotation(p: ChessPiece, fr: number, fc: number, tr: number, tc: number, isCap: boolean, isCastle?:boolean, isEP?:boolean, promo?:PieceType): string {
    if(isCastle) return tc===6?'O-O':'O-O-O';
    const pLetter = p.type === 'p' ? (isCap ? this.getFileLabel(fc) : '') : p.type.toUpperCase();
    const capSign = isCap ? 'x' : '';
    const dest = `${this.getFileLabel(tc)}${8 - tr}`;
    return `${pLetter}${capSign}${dest}${promo?'='+promo.toUpperCase():''}${isEP?' e.p.':''}`;
  }
  gameStatusText(): string {
    if (this.isGameOver()) {
      const winner = this.gameWinner();
      if (winner === 'w') return '🏆 Checkmate! White Wins!';
      if (winner === 'b') return '🏆 Checkmate! Black Wins!';
      return '🤝 Draw! ' + this.gameOverReason();
    }
    return this.turn() === 'w' ? '⚪ White’s Turn' : '⚫ Black’s Turn';
  }
  statusBoxClass(): string { if (this.isGameOver()) return 'game-won'; return 'active-turn'; }
  getTurnNumbers(): number[] { const count = Math.ceil(this.moveHistory().length / 2); return Array.from({ length: count }, (_, i) => i + 1); }
  getMoveNotation(turnNum: number, color: PieceColor): string {
    const index = (turnNum - 1) * 2 + (color === 'w' ? 0 : 1);
    const m = this.moveHistory()[index]; return m ? m.notation || '' : '';
  }
}
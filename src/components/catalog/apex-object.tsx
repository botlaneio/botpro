"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Layers, Pause, Play, RotateCcw } from "lucide-react"
import styles from "./apex-object.module.css"

export function ApexObject() {
  const reduce = useReducedMotion()
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [replay, setReplay] = useState(0)
  return <figure className={styles.stage}>
    <div className={styles.topline}><span>APEX / MOTION STUDY 001</span><span>FORM → FEELING</span></div>
    <div className={styles.viewport}>
      <div aria-hidden className={styles.grid}/>
      <span aria-hidden className={styles.watermark}>A</span>
      <motion.div key={replay} className={styles.sculpture} aria-hidden
        initial={false}
        animate={{ rotateY: playing && !reduce ? [-22, 338] : -22, rotateX: expanded ? 18 : -12 }}
        transition={{ rotateY: { duration: playing && !reduce ? 5 : 0.32, ease: "easeInOut" }, rotateX:{duration:reduce?0:0.5} }}
        onAnimationComplete={()=>setPlaying(false)}>
        {Array.from({length:11},(_,i)=><motion.div key={i} className={styles.fin}
          animate={{z:(i-5)*(expanded?29:13), y:expanded?Math.abs(i-5)*-7:0, rotateZ:expanded?(i-5)*3:0}}
          transition={{duration:reduce?0:0.5,ease:[0.2,0,0.2,1]}}>
          <div className={styles.face}/><div className={styles.edge}/>
        </motion.div>)}
      </motion.div>
      <div className={styles.caption}><span>SIGNATURE BY DESIGN.</span><span>Concept geometry<br/>Rendered in your browser.</span></div>
    </div>
    <div className={styles.controls}>
      <button aria-pressed={expanded} onClick={()=>setExpanded(v=>!v)}><Layers size={14} aria-hidden/>{expanded?"Assemble":"Pull apart"}</button>
      <button disabled={!!reduce} aria-pressed={playing} onClick={()=>{if(playing)setPlaying(false);else {setReplay(v=>v+1);setPlaying(true)}}}>{playing?<Pause size={14} aria-hidden/>:<Play size={14} aria-hidden/>}{reduce?"Motion reduced":playing?"Stop rotation":"Rotate object"}</button>
      <button aria-label="Reset motion study" onClick={()=>{setExpanded(false);setPlaying(false);setReplay(v=>v+1)}}><RotateCcw size={14} aria-hidden/></button>
    </div>
    <figcaption className={styles.note}>An interactive motion concept. Your signature is designed around your brand.</figcaption>
  </figure>
}

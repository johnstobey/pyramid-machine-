'use client';
import { useState, useEffect } from 'react';
import tobeypyramidunifiedreportData from './tobeyData';

export interface LessonTitle {
  [key: string]: string;
}

export interface LinguisticData {
  total_paragraphs: number;
  total_sentences: number;
  total_words: number;
  unique_words: number;
  lexical_density: number;
  taxonomy: Record<string, number>;
  hapax_legomena_count: number;
  hapax_legomena_sample: string[];
  paragraph_word_counts: number[];
  sentence_word_counts: number[];
}

export interface MathematicalData {
  lesson: number;
  ring_position: number;
  word_count: number;
  is_fibonacci: boolean;
  sentence_count: number;
  phi: number;
  phi_proximity_count: number;
  phi_proximity_values: number[];
  fibonacci_sentence_indices: number[];
  fibonacci_sentence_count: number;
  checksum_653184000_mods: Record<string, number>;
  word_count_mods: Record<string, number>;
}

export interface EdgeData {
  lessons: number[];
  type: string;
  slope_angle_deg: number;
  harmonic_622_08: number;
  combined_word_count: number;
  lesson_word_ratio: number;
  pi_convergence: number;
  phi_convergence: number;
}

export interface AcousticData {
  vowels: Record<string, { coord: number; role: string; count: number }>;
  total_vowels: number;
  vowel_dominance_order: string[];
  dominant_vowel: string;
  dominant_vowel_role: string;
  consonants: Record<string, { count: number; role: string }>;
  total_consonants: number;
  vowel_to_consonant_ratio: number;
  time_signature: string;
  active_resonance_state: string;
}

export interface TobeyReport {
  metadata: {
    course: string;
    author: string;
    lessons: number;
    total_words: number;
    total_sentences: number;
    total_paragraphs: number;
    checksum_653184000: number;
    harmonic_angle_deg: number;
    harmonic_multiplier_622_08: number;
    pyramid_edges: number;
    phi: number;
    pi: number;
  };
  lesson_titles: LessonTitle;
  linguistic_layer: Record<string, LinguisticData>;
  mathematical_layer: Record<string, MathematicalData>;
  geometric_layer: {
    pyramid_dimensions: Record<string, number>;
    edge_mapping: Record<string, EdgeData>;
    decomposition_4x3: Record<string, Record<string, EdgeData>>;
    harmonic_validation: Record<string, number>;
  };
  acoustic_layer: Record<string, AcousticData>;
  cryptographic_layer: {
    cayley_table: Record<string, number[]>;
    algorithm_matrix_size: number;
    algorithm_sample: string[];
    per_lesson_cipher_values: Record<string, number>;
    cipher_ring_distribution: Record<string, number>;
  };
  validation: {
    checksum_validation?: { all_mods_zero: boolean };
    harmonic_drift?: { drift: number };
    acoustic_consistency?: { all_dominant_e: boolean; all_syllabic_pulse: boolean };
    geometric_integrity?: { all_edges_51_84: boolean; harmonic_product_622_08: boolean };
  };
}

export function useTobeyData() {
  const [data, setData] = useState<TobeyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setData(tobeypyramidunifiedreportData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return { data, loading, error };
}

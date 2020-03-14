
declare namespace IstanbulGhPRUncovered {
  interface UncoveredFile {
    /**
     * The filename with uncovered lines
    */
    filename: string;

    /**
     * An array of line numbers which represents the lines which are not covered by test 
     */
    lines: ReadonlyArray<number>;
  }
} 
export interface OthersSettings {
    thread?: number;
    prefix?: string;
    appendCommandLine?: string;

    /**
     * Command to pipe jobs into.
     */
    submitCommand?: string;
    /**
     * Template to append command line to.
     */
    submitTemplate?: string;
    /**
     * Command to check job status.
     */
    checkCommand?: string;
}
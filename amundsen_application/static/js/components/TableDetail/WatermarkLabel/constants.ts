export const WATERMARK_INPUT_FORMAT = "YYYY-MM-DD";
export const WATERMARK_DISPLAY_FORMAT = "MMM DD, YYYY";
export const NO_WATERMARK_LINE_1 = "Non-Partitioned Table";
export const NO_WATERMARK_LINE_2 = "Data available for all dates";

export enum WatermarkType {
  HIGH = "high_watermark",
  LOW = "low_watermark",
}

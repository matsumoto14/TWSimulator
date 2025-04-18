/// 数値を3桁区切りでフォーマット
pub fn format_number(num: u32) -> String {
    let mut result = String::new();
    let num_str = num.to_string();
    let len = num_str.len();
    
    for (i, c) in num_str.chars().enumerate() {
        result.push(c);
        if (len - i - 1) % 3 == 0 && i < len - 1 {
            result.push(',');
        }
    }
    
    result
}

/// 小数点以下の桁数を指定してフォーマット
pub fn format_float(num: f32, digits: usize) -> String {
    format!("{:.*}", digits, num)
}

/// パーセント表示用のフォーマット
pub fn format_percent(value: f32, digits: usize) -> String {
    format!("{:.*}%", digits, value * 100.0)
}

/// 時間（秒）を分:秒形式でフォーマット
pub fn format_time(seconds: f32) -> String {
    let minutes = (seconds / 60.0).floor() as u32;
    let secs = (seconds % 60.0).round() as u32;
    
    if minutes > 0 {
        format!("{}分{}秒", minutes, secs)
    } else {
        format!("{}秒", secs)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_format_number() {
        assert_eq!(format_number(1000), "1,000");
        assert_eq!(format_number(1000000), "1,000,000");
        assert_eq!(format_number(123), "123");
    }
    
    #[test]
    fn test_format_float() {
        assert_eq!(format_float(123.456, 2), "123.46");
        assert_eq!(format_float(123.456, 1), "123.5");
        assert_eq!(format_float(123.0, 0), "123");
    }
    
    #[test]
    fn test_format_percent() {
        assert_eq!(format_percent(0.1234, 2), "12.34%");
        assert_eq!(format_percent(0.1, 0), "10%");
    }
    
    #[test]
    fn test_format_time() {
        assert_eq!(format_time(30.0), "30秒");
        assert_eq!(format_time(90.0), "1分30秒");
        assert_eq!(format_time(3600.0), "60分0秒");
    }
}

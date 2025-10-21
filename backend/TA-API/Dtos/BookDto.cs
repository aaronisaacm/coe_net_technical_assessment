namespace TA_API.DTOs
{
    public class BookDto
    {
        public int BookId { get; set; }
        public string BookName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
    }
}


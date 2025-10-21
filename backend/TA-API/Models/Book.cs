using System.ComponentModel.DataAnnotations.Schema;

namespace TA_API.Models
{
    [Table("Books")]
    public class Book
    {
        public int BookId { get; set; }
        public string BookName { get; set; }
        public string  Description { get; set; }
        public string Author { get; set; }
    }
}

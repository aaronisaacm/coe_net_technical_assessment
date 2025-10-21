using System.ComponentModel.DataAnnotations.Schema;

namespace TA_API.Models
{   
    [Table("Users")]
    public class User
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
    }
}

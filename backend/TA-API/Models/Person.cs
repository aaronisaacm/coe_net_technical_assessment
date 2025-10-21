using System.ComponentModel.DataAnnotations.Schema;

namespace TA_API.Models
{   
    [Table("People")]
    public class Person
    {
        public int PersonId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
    }
}

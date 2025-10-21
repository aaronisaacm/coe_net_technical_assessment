namespace TA_API.DTOs
{
    public class PersonDto
    {
        public int PersonId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName => $"{Name} {LastName}";
    }
}


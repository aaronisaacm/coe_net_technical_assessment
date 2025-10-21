namespace TA_API.DTOs
{
    public class BookLoanDto
    {
        public int BookLoanId { get; set; }
        public int PersonId { get; set; }
        public int BookId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsReturned { get; set; }
        public bool IsOverdue => !IsReturned && DateTime.Now > DueDate;
        
        // Navigation properties as DTOs
        public PersonDto? Person { get; set; }
        public BookDto? Book { get; set; }
    }
}


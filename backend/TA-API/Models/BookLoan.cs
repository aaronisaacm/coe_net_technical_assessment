using System.ComponentModel.DataAnnotations.Schema;

namespace TA_API.Models
{
    [Table("BookLoans")]
    public class BookLoan
    {
        public int BookLoanId { get; set; }
        
        // Foreign Keys
        public int PersonId { get; set; }
        public int BookId { get; set; }
        
        // Loan Details
        public DateTime LoanDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsReturned { get; set; }
        
        // Navigation Properties
        public Person? Person { get; set; }
        public Book? Book { get; set; }
    }
}


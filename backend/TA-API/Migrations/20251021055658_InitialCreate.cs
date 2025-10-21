using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TA_API.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Books",
                columns: table => new
                {
                    BookId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BookName = table.Column<string>(type: "TEXT", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "TEXT", maxLength: 500, nullable: false),
                    Author = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.BookId);
                });

            migrationBuilder.CreateTable(
                name: "People",
                columns: table => new
                {
                    PersonId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "TEXT", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_People", x => x.PersonId);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "BookLoans",
                columns: table => new
                {
                    BookLoanId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PersonId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookId = table.Column<int>(type: "INTEGER", nullable: false),
                    LoanDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DueDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsReturned = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookLoans", x => x.BookLoanId);
                    table.ForeignKey(
                        name: "FK_BookLoans_Books_BookId",
                        column: x => x.BookId,
                        principalTable: "Books",
                        principalColumn: "BookId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookLoans_People_PersonId",
                        column: x => x.PersonId,
                        principalTable: "People",
                        principalColumn: "PersonId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "BookId", "Author", "BookName", "Description" },
                values: new object[,]
                {
                    { 1, "Robert C. Martin", "Clean Code", "A handbook of agile software craftsmanship" },
                    { 2, "Gang of Four", "Design Patterns", "Elements of reusable object-oriented software" },
                    { 3, "Andrew Hunt, David Thomas", "The Pragmatic Programmer", "Your journey to mastery" },
                    { 4, "Martin Fowler", "Refactoring", "Improving the design of existing code" },
                    { 5, "Frederick Brooks", "The Mythical Man-Month", "Essays on software engineering" },
                    { 6, "Steve McConnell", "Code Complete", "A practical handbook of software construction" },
                    { 7, "Eric Evans", "Domain-Driven Design", "Tackling complexity in the heart of software" },
                    { 8, "Thomas H. Cormen", "Introduction to Algorithms", "Comprehensive algorithms textbook" }
                });

            migrationBuilder.InsertData(
                table: "People",
                columns: new[] { "PersonId", "LastName", "Name" },
                values: new object[,]
                {
                    { 1, "Isaac", "Aaron" },
                    { 2, "Smith", "John" },
                    { 3, "Johnson", "Emma" },
                    { 4, "Williams", "Michael" },
                    { 5, "Brown", "Sarah" }
                });

            migrationBuilder.InsertData(
                table: "BookLoans",
                columns: new[] { "BookLoanId", "BookId", "DueDate", "IsReturned", "LoanDate", "PersonId", "ReturnDate" },
                values: new object[,]
                {
                    { 1, 1, new DateTime(2025, 10, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2025, 10, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, null },
                    { 2, 3, new DateTime(2025, 11, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2025, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, null },
                    { 3, 5, new DateTime(2025, 11, 7, 0, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2025, 10, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, null },
                    { 4, 2, new DateTime(2025, 9, 29, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 9, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, new DateTime(2025, 9, 25, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 5, 4, new DateTime(2025, 10, 8, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, new DateTime(2025, 10, 5, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 6, 6, new DateTime(2025, 9, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 8, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 5, new DateTime(2025, 9, 10, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 7, 7, new DateTime(2025, 9, 17, 0, 0, 0, 0, DateTimeKind.Unspecified), true, new DateTime(2025, 8, 20, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, new DateTime(2025, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 8, 8, new DateTime(2025, 10, 13, 0, 0, 0, 0, DateTimeKind.Unspecified), false, new DateTime(2025, 9, 15, 0, 0, 0, 0, DateTimeKind.Unspecified), 4, null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_BookId",
                table: "BookLoans",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_PersonId",
                table: "BookLoans",
                column: "PersonId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookLoans");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Books");

            migrationBuilder.DropTable(
                name: "People");
        }
    }
}

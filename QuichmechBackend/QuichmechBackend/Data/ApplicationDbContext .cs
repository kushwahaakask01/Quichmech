using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuichmechBackend.Models;

namespace QuichmechBackend.Data
{
    public class ApplicationDbContext: IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<Mechanic> Mechanics { get; set; }
        public DbSet<ServiceRequest> ServiceRequests { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<MechanicServiceModel> MechanicServices { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User configurations
            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.FirstName).HasMaxLength(100);
                entity.Property(e => e.LastName).HasMaxLength(100);
            });

            // Customer configurations
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Customer)
                    .HasForeignKey<Customer>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId).IsUnique();
            });

            // Mechanic configurations
            modelBuilder.Entity<Mechanic>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.User)
                    .WithOne(u => u.Mechanic)
                    .HasForeignKey<Mechanic>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.UserId).IsUnique();
                entity.Property(e => e.HourlyRate).HasColumnType("decimal(18,2)");
            });

            // ServiceRequest configurations
            modelBuilder.Entity<ServiceRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.ServiceRequests)
                    .HasForeignKey(e => e.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Mechanic)
                    .WithMany(m => m.ServiceRequests)
                    .HasForeignKey(e => e.MechanicId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.EstimatedCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.FinalCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status)
                    .HasConversion<string>()
                    .HasMaxLength(50);
            });

            // Review configurations
            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.ServiceRequest)
                    .WithOne(sr => sr.Review)
                    .HasForeignKey<Review>(e => e.ServiceRequestId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Customer)
                    .WithMany(c => c.Reviews)
                    .HasForeignKey(e => e.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Mechanic)
                    .WithMany(m => m.Reviews)
                    .HasForeignKey(e => e.MechanicId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasIndex(e => e.ServiceRequestId).IsUnique();
            });

            // MechanicService configurations
            modelBuilder.Entity<MechanicServiceModel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(e => e.Mechanic)
                    .WithMany(m => m.MechanicServices)
                    .HasForeignKey(e => e.MechanicId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            });
        }
    }

}
